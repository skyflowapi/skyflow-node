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

if (!gitleaksAvailable()) {
  console.warn(
    "gitleaks isn't installed locally - skipping auto-redaction of generated code. " +
      "CI will still scan for this.",
  );
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
  process.exit(1);
}

const byFile = new Map();
for (const finding of findings) {
  if (!byFile.has(finding.File)) byFile.set(finding.File, []);
  byFile.get(finding.File).push(finding);
}

const originalContents = new Map();
let redactedCount = 0;

for (const [relativeFile, fileFindings] of byFile) {
  const filePath = path.join(repoRoot, relativeFile);
  let content = fs.readFileSync(filePath, "utf8");
  originalContents.set(filePath, content);

  // Assign a distinct placeholder per unique secret value, numbering only
  // when the same rule fires more than once in the same file (so two
  // different example tokens don't collapse into one identical placeholder).
  // Longest-first ordering avoids a rare but real hazard: if one finding's
  // secret text happened to be a substring of another's, redacting the
  // shorter one first would consume part of the longer one, and the later
  // `content.includes(secret)` check for it would then (correctly) come up
  // empty. That finding would just be silently skipped here - which is fine,
  // because the post-redaction gitleaks re-scan below still catches any
  // secret that didn't actually get replaced and fails the run for review.
  const uniqueSecrets = [...new Set(fileFindings.map((f) => f.Secret))].sort(
    (a, b) => b.length - a.length,
  );
  const byRule = new Map();
  for (const secret of uniqueSecrets) {
    const ruleID = fileFindings.find((f) => f.Secret === secret).RuleID;
    const base = placeholderFor(ruleID);
    const seen = byRule.get(base) || 0;
    byRule.set(base, seen + 1);
    const placeholder = seen === 0 ? base : base.replace(">", `_${seen + 1}>`);

    if (content.includes(secret)) {
      content = content.split(secret).join(placeholder);
      redactedCount += 1;
      console.log(`[${ruleID}] redacted in ${relativeFile} -> ${placeholder}`);
    }
  }

  fs.writeFileSync(filePath, content);
}

const localTsc = path.join(repoRoot, "node_modules", ".bin", "tsc");
if (!fs.existsSync(localTsc)) {
  for (const [filePath, content] of originalContents) {
    fs.writeFileSync(filePath, content);
  }
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
  for (const [filePath, content] of originalContents) {
    fs.writeFileSync(filePath, content);
  }
  console.error(
    "Rolled back. Redaction needs manual review - see the tsc output above.",
  );
  process.exit(1);
}

const remaining = runGitleaksDetect(
  GENERATED_CODE_PREFIX.replace(/\/$/, ""),
  repoRoot,
);
if (remaining.length > 0) {
  console.error(
    `Redacted ${redactedCount} secret(s), but ${remaining.length} finding(s) remain after re-scanning. Manual review needed:\n` +
      remaining
        .map((f) => `  - [${f.RuleID}] ${f.File}:${f.StartLine}`)
        .join("\n"),
  );
  process.exit(1);
}

console.log(
  `\nDone. Redacted ${redactedCount} secret(s) across ${byFile.size} file(s). Build and gitleaks re-scan both clean.`,
);
