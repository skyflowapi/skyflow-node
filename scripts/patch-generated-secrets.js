/**
 * Auto-redacts gitleaks findings inside src/_generated_.
 *
 * The Fern generator owns that directory and overwrites it on every regen,
 * so realistic-looking example secrets in JSDoc comments (a fake JWT, a
 * fake token UUID, ...) keep coming back. Rather than hand-maintaining a
 * list of specific strings to find/replace - which can only ever catch the
 * exact values someone already noticed - this script lets the real
 * `gitleaks` binary evaluate Rule/gitleaks.toml (every rule, every
 * allowlist, every entropy threshold) against the generated code, then
 * replaces whatever it reports as a secret with a placeholder. That's the
 * only way to genuinely cover "everything gitleaks.toml flags" - the config
 * has ~170 rules with layered allowlists; reimplementing that logic by hand
 * in a second regex engine would just be a worse, drifting copy of gitleaks
 * itself.
 *
 * Safety:
 *   - Scope is hard-limited to src/_generated_ via --source; nothing else
 *     is ever scanned or touched.
 *   - Before touching anything, a behavioral self-test confirms the local
 *     `gitleaks` binary actually honors this config's `regexTarget: "line"`
 *     allowlists (added in a gitleaks release newer than some OS packages,
 *     e.g. Ubuntu's apt build - see AGENTS.md discussion). An older binary
 *     silently ignores that field and would misclassify ordinary code
 *     (e.g. a plain `import { A, B } from '...'` line) as a leak, which
 *     this script would then corrupt by "redacting" it. If the self-test
 *     fails, nothing is touched.
 *   - Redaction itself never reads a finding's reported "Secret" text. It
 *     uses gitleaks' (StartLine, StartColumn) only as an approximate
 *     anchor to locate the surrounding quoted string literal in the
 *     actual file content, then redacts strictly between its quotes - see
 *     findQuotedValueSpan. This sidesteps two problems in one move: some
 *     locally observed gitleaks builds report a "Secret" that swallows a
 *     trailing quote (would corrupt the surrounding code) or an
 *     off-by-one column for certain rules, and reading that field at all
 *     is a source CodeQL's clear-text-logging/storage-sensitive-data
 *     queries key off of.
 *   - After redacting, `tsc --noEmit` verifies the generated code still
 *     compiles. If it doesn't, every change made in this run is rolled
 *     back and the run fails - a broken build is never left in place
 *     silently.
 *   - A final gitleaks re-scan confirms the redaction actually worked.
 *
 * Usage: node scripts/patch-generated-secrets.js
 * Exit codes: 0 = clean (nothing to do, or successfully redacted and
 * verified). 1 = something needs a human: gitleaks isn't trustworthy here,
 * or redacting broke the build.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
// Note the literal space before "_generated_" - that's the real directory
// name in this repo (not a typo here), so it must match exactly.
const GENERATED_CODE_PREFIX = "src/ _generated_/";
const CONFIG_PATH = path.join(repoRoot, "Rule", "gitleaks.toml");

function gitleaksAvailable() {
  try {
    execFileSync("gitleaks", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Runs gitleaks and returns its parsed JSON findings. gitleaks exits 1 when
// it finds leaks (not an error), so only treat it as a real failure if no
// report file was produced. Runs several times per invocation (self-test,
// main scan, final re-scan), so the scratch dir is always removed before
// returning - otherwise every commit leaves junk behind in the OS temp dir.
function runGitleaksDetect(sourceDir, cwd) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "leak-guard-"));
  const reportPath = path.join(tmpDir, "report.json");
  try {
    try {
      execFileSync(
        "gitleaks",
        [
          "detect",
          "--no-git",
          `--config=${CONFIG_PATH}`,
          `--source=${sourceDir}`,
          "--report-format=json",
          `--report-path=${reportPath}`,
        ],
        { cwd, stdio: "ignore" },
      );
    } catch (err) {
      if (!fs.existsSync(reportPath)) {
        throw new Error(`gitleaks invocation failed: ${err.message}`);
      }
    }
    return JSON.parse(fs.readFileSync(reportPath, "utf8"));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// Confirms the installed gitleaks honors regexTarget="line" allowlists,
// which Rule/gitleaks.toml relies on to exempt lines like
// `import { A, B } from '...'` from the generic-api-key rule. Without this,
// an older gitleaks build (e.g. Ubuntu's apt package) would silently
// misclassify - and this script would then "redact" - ordinary code.
function selfTestAllowlistSupport() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "leak-guard-selftest-"));
  try {
    // Built from separate pieces rather than one literal string: an older
    // gitleaks (the exact case this test detects) would otherwise flag this
    // line inside this very file, since it lives outside src/_generated_
    // and tier 1's scope doesn't cover it - the probe would trip the bug
    // it's meant to catch.
    const probeImportLine = [
      "import { V1GetAuthTokenRequest,",
      "V1GetAuthTokenResponse } from",
      "'../ _generated_/rest/api';\n",
    ].join(" ");
    fs.writeFileSync(path.join(dir, "probe.ts"), probeImportLine);
    return runGitleaksDetect(dir, repoRoot).length === 0;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function placeholderFor(ruleID) {
  return `<REDACTED_${ruleID.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}>`;
}

const QUOTE_CHARS = new Set(['"', "'", "`"]);
// How far findQuotedValueSpan will search outward from gitleaks' reported
// (line, column) for an actual quote character in the file. Only needs to
// cover small reporting inaccuracies (a couple of characters), not
// arbitrary distances - see its comment below.
const QUOTE_SEARCH_WINDOW = 8;

// Absolute char offset where each 1-indexed line starts in `text`.
// offsets[line - 1] is the offset of `line`. Used to turn gitleaks'
// 1-indexed (line, column) position into a plain absolute offset into
// `text`.
function lineStartOffsets(text) {
  const offsets = [0];
  for (const lineText of text.split("\n")) {
    offsets.push(offsets[offsets.length - 1] + lineText.length + 1);
  }
  return offsets;
}

// Finds [valueStart, valueEnd) strictly inside the quoted string literal
// nearest to `approxPos`, or null if there isn't one.
//
// Every flagged value in these generated files is a quoted example (e.g.
// `assertion: "..."`), and gitleaks' reported column can be off by a
// character (observed on the "jwt" rule with at least one locally
// installed gitleaks build) or include a trailing delimiter it shouldn't
// (also observed on "jwt" - the reported Secret text itself included the
// closing quote), so this never trusts the exact position or reads the
// flagged value's own text - it searches a small window in `content`
// around the approximate position for an actual quote character, then
// finds its matching closing quote. Because this only ever looks at
// `content` and plain integer offsets, the redaction below has no
// dependency on gitleaks' "Secret" field at all - not just a fix for the
// trailing-quote bug, but also structurally free of the taint path
// CodeQL's clear-text-logging/storage-sensitive-data queries would
// otherwise follow from that field into console.log()/writeFileSync().
function findQuotedValueSpan(content, approxPos) {
  const n = content.length;
  for (let delta = 0; delta <= QUOTE_SEARCH_WINDOW; delta++) {
    // Backward first: the one observed real-world case (an off-by-one
    // StartColumn on the "jwt" rule) landed one character INSIDE the
    // value, so the nearest quote is behind it, not ahead of it.
    const candidates = delta === 0 ? [approxPos] : [approxPos - delta, approxPos + delta];
    for (const pos of candidates) {
      if (pos >= 0 && pos < n && QUOTE_CHARS.has(content[pos])) {
        const valueStart = pos + 1;
        const valueEnd = content.indexOf(content[pos], valueStart);
        return valueEnd === -1 ? null : [valueStart, valueEnd];
      }
    }
  }
  return null;
}

// Records exactly which files this run modified (an empty list if none),
// so the pre-commit hook can stage only those - plus whatever the caller
// already had staged - instead of the entire generated-code directory,
// which would otherwise sweep in unrelated or intentionally-unstaged
// in-progress changes sitting in that same directory. Called at every exit
// point so the hook never reads a stale list left over from a prior run.
// Best-effort: if this can't be written, the hook simply finds no list and
// stages nothing beyond what was already staged.
function recordTouchedFiles(relativeFiles) {
  try {
    const gitDir = execFileSync("git", ["rev-parse", "--git-dir"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    const listPath = path.resolve(repoRoot, gitDir, "leak-guard-touched-files.txt");
    fs.writeFileSync(listPath, relativeFiles.map((f) => `${f}\n`).join(""));
  } catch {
    // ignored - see comment above
  }
}

if (!gitleaksAvailable()) {
  console.warn(
    "gitleaks isn't installed locally - skipping auto-redaction of generated code. " +
      "CI will still scan for this.",
  );
  recordTouchedFiles([]);
  process.exit(0);
}

if (!selfTestAllowlistSupport()) {
  console.error(
    'Local gitleaks failed a self-test: it flagged an ordinary `import { A, B } from "..."` line ' +
      "that Rule/gitleaks.toml explicitly allowlists. That means this gitleaks build silently " +
      'ignores regexTarget="line" allowlists and would misclassify (and corrupt) real code as a ' +
      "secret. Refusing to auto-redact - please upgrade gitleaks (run `gitleaks version`; " +
      "CI uses zricethezav/gitleaks:latest) and try again.",
  );
  recordTouchedFiles([]);
  process.exit(1);
}

// Pass a repo-relative source path (with cwd set to repoRoot) rather than an
// absolute one - gitleaks mirrors whichever form --source takes in the
// "File" field of its report, and the scope check below needs it relative.
const findings = runGitleaksDetect(
  GENERATED_CODE_PREFIX.replace(/\/$/, ""),
  repoRoot,
);

if (findings.length === 0) {
  console.log("No gitleaks findings in generated code.");
  recordTouchedFiles([]);
  process.exit(0);
}

const outOfScope = findings.filter(
  (f) => !f.File.startsWith(GENERATED_CODE_PREFIX),
);
if (outOfScope.length > 0) {
  // Should be unreachable given --source is scoped to the generated dir -
  // but never silently redact outside that boundary.
  console.error(
    "Refusing to continue: gitleaks reported findings outside the generated code directory:\n" +
      outOfScope.map((f) => `  - ${f.File}`).join("\n"),
  );
  recordTouchedFiles([]);
  process.exit(1);
}

const byFile = new Map();
for (const finding of findings) {
  if (!byFile.has(finding.File)) byFile.set(finding.File, []);
  byFile.get(finding.File).push(finding);
}

const originalContents = new Map();
const touchedFiles = new Set();
let redactedCount = 0;

// Restores every file this run has written so far back to what it read at
// the start. Called from every failure path after files start getting
// written, so a build break, a final-scan tool failure, or leftover
// findings after redaction never leaves a partially-redacted, unverified
// file sitting in the working tree.
function rollback() {
  for (const [filePath, content] of originalContents) {
    fs.writeFileSync(filePath, content);
  }
  recordTouchedFiles([]);
}

// Redacts by position - gitleaks' own (StartLine, StartColumn), an
// approximate anchor used only to locate the surrounding quoted string
// literal in each file's content (see findQuotedValueSpan) - and never
// reads finding.Secret at all.
//
// Resolved in a first pass, across ALL files, before anything is written:
// an unresolved finding in a later file must not leave an earlier file's
// already-computed redaction written to disk with no way back.
const fileContents = new Map();
const uniqueSpansByFile = new Map();
const unresolved = [];
for (const [relativeFile, fileFindings] of byFile) {
  const filePath = path.join(repoRoot, relativeFile);
  const content = fs.readFileSync(filePath, "utf8");
  fileContents.set(filePath, content);

  const lineOffsets = lineStartOffsets(content);
  const spans = [];
  for (const finding of fileFindings) {
    const approxPos = lineOffsets[finding.StartLine - 1] + (finding.StartColumn - 1);
    const span = findQuotedValueSpan(content, approxPos);
    if (span === null) {
      unresolved.push([relativeFile, finding]);
      continue;
    }
    spans.push([span[0], span[1], finding.RuleID]);
  }

  // Deduplicate by [start, end]: if two rules flag the exact same span, it
  // must only be redacted once. Applied back-to-front (highest offset
  // first) so replacing a later span never shifts the offsets of an
  // earlier one still waiting to be processed.
  const seenSpans = new Map();
  for (const [start, end, ruleID] of spans) seenSpans.set(`${start}:${end}`, [start, end, ruleID]);
  const uniqueSpans = [...seenSpans.values()].sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  uniqueSpansByFile.set(filePath, uniqueSpans);
}

if (unresolved.length > 0) {
  console.error(
    "Refusing to continue: couldn't locate a quoted value near " +
      `${unresolved.length} finding(s) - this script only knows how to redact ` +
      '`key: "value"`-shaped examples. Manual review needed:\n' +
      unresolved.map(([rel, f]) => `  - [${f.RuleID}] ${rel}:${f.StartLine}`).join("\n"),
  );
  recordTouchedFiles([]);
  process.exit(1);
}

for (const [filePath, spans] of uniqueSpansByFile) {
  const relativeFile = path.relative(repoRoot, filePath);
  let content = fileContents.get(filePath);
  originalContents.set(filePath, content);

  // Assign a distinct placeholder per span, numbering only when the same
  // rule fires more than once in the same file (so two different example
  // values don't collapse into one identical placeholder).
  const byRule = new Map();
  for (const [start, end, ruleID] of spans) {
    const base = placeholderFor(ruleID);
    const seen = byRule.get(base) || 0;
    byRule.set(base, seen + 1);
    // base is always `<REDACTED_RULEID>` (placeholderFor always ends it with
    // exactly one ">"), so slice that off and re-append it with the suffix
    // rather than using String#replace, which CodeQL flags as an
    // incomplete-escaping-style bug (replaces only the first occurrence)
    // even though there's only ever one to begin with here.
    const placeholder = seen === 0 ? base : `${base.slice(0, -1)}_${seen + 1}>`;

    content = content.slice(0, start) + placeholder + content.slice(end);
    redactedCount += 1;
    console.log(`[${ruleID}] redacted in ${relativeFile} -> ${placeholder}`);
  }

  fs.writeFileSync(filePath, content);
  if (content !== originalContents.get(filePath)) {
    touchedFiles.add(relativeFile);
  }
}

const localTsc = path.join(repoRoot, "node_modules", ".bin", "tsc");
if (!fs.existsSync(localTsc)) {
  rollback();
  console.error(
    `${localTsc} not found (run \`npm install\`) - can't verify redaction is safe, so rolling back and refusing to redact.`,
  );
  process.exit(1);
}

let buildOk = true;
try {
  execFileSync(localTsc, ["--noEmit"], { cwd: repoRoot, stdio: "pipe" });
} catch (err) {
  buildOk = false;
  console.error(
    "tsc --noEmit failed after redaction - rolling back all changes from this run.",
  );
  console.error(err.stdout ? err.stdout.toString() : err.message);
}

if (!buildOk) {
  rollback();
  console.error(
    "Rolled back. Redaction needs manual review - see the tsc output above.",
  );
  process.exit(1);
}

// The redaction itself, and this verification re-scan, can each fail for
// reasons other than "still leaks" (e.g. the gitleaks binary crashing
// mid-run) - runGitleaksDetect throws in that case rather than returning a
// findings list. Either way, an unverified redaction must never be left on
// disk: roll back exactly as the tsc-failure path above does.
let remaining;
try {
  remaining = runGitleaksDetect(GENERATED_CODE_PREFIX.replace(/\/$/, ""), repoRoot);
} catch (err) {
  rollback();
  console.error(
    `Final gitleaks re-scan failed to run (${err.message}) - rolling back all changes from this run. Redaction needs manual review.`,
  );
  process.exit(1);
}
if (remaining.length > 0) {
  rollback();
  console.error(
    `Redacted ${redactedCount} secret(s), but ${remaining.length} finding(s) remain after re-scanning. ` +
      "Rolled back all changes from this run. Manual review needed:\n" +
      remaining
        .map((f) => `  - [${f.RuleID}] ${f.File}:${f.StartLine}`)
        .join("\n"),
  );
  process.exit(1);
}

recordTouchedFiles([...touchedFiles]);
console.log(
  `\nDone. Redacted ${redactedCount} secret(s) across ${byFile.size} file(s). Build and gitleaks re-scan both clean.`,
);
