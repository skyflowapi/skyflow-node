Generate or update a doc comparing user-exposed functionality and public behavioral differences between two SDKs fetched from git, in any language. Argument: $ARGUMENTS

This command always fetches fresh clones from git — it never compares this repo's own `Skyflow/` vs `SkyflowFlowVault/` directories. For that, use `/sdk-behavioral-differences` instead.

## Getting the two SDKs to compare

$ARGUMENTS must contain **two git sources**, each as a URL (`https://...`, `git@...`, or anything `git clone` accepts), optionally followed by:
- a ref (branch, tag, or commit) — as `@<ref>` appended to the URL, or stated in words ("branch release/3.2")
- a subdirectory to treat as the SDK root within that repo (for a monorepo where the SDK isn't at the repo root)
- a short label to use in headings (e.g. "android", "js-v2", "legacy")

If $ARGUMENTS contains fewer than two git sources, **stop and ask the user** for both — never fall back to comparing local paths in this repo, and never invent a URL. Never guess another SDK's shape or behavior from memory; only read what's actually cloned.

### Cloning

1. Create a scratch directory for this run (the session scratchpad if one is available, otherwise a fresh `mktemp -d`).
2. For each source: `git clone --depth 1 [--branch <ref>] <url> <scratch>/<label>`. If a ref was given as a commit SHA rather than a branch/tag, clone default depth-1 first, then `git fetch --depth 1 origin <sha> && git checkout <sha>`.
3. If a subdirectory was specified, treat `<scratch>/<label>/<subdir>` as that SDK's root for every step below.
4. If a clone fails (bad URL, missing ref, private repo without access), stop and report the exact git error — don't retry with a guessed alternative ref or URL.

### Detecting language and structure

Per cloned SDK, detect the language and public entry point from what's actually there — don't assume both sides match this repo's Swift/SPM layout:
- Package manifest: `Package.swift`, `package.json`, `build.gradle`/`build.gradle.kts`, `pom.xml`, `*.podspec`/`*.gemspec`, `pyproject.toml`/`setup.cfg`, `Cargo.toml`, `*.csproj`.
- Public entry point(s): the main client/module the manifest's product/library name points at, and everything it exports.
- If the repo has multiple products/targets (like this repo's own `Skyflow` + `SkyflowFlowVault`), and $ARGUMENTS didn't already disambiguate with a subdirectory, list the candidates found and ask the user which one is the intended SDK before proceeding.

State each side's resolved git URL, ref, subdirectory (if any), and detected language explicitly in the doc's header, so a wrong resolution is visible at a glance.

## Scope: public-surface functionality only

This doc is about what an app developer integrating either SDK can actually **do, configure, or observe** through the public API — not internal implementation detail. For every candidate finding, ask: "would an app developer notice this without reading the SDK's source?" If no, leave it out.

**In scope:**
- Whether an equivalent public call exists, and if so under what name/signature.
- A parameter, option, or config value one SDK accepts and the other doesn't, or that changes what can be expressed.
- A difference in what data the app receives back (e.g. whether a sensitive value is ever exposed, whether partial-batch failure surfaces per item).
- A difference in whether an equivalent public call succeeds or fails for the same input.

**Out of scope — do not include:**
- Raw wire/payload key naming, unless the public callback hands the app that raw payload directly and the key difference changes what the app can read.
- Internal implementation quality, algorithmic detail, or code style that isn't a deliberate functional difference.
- Cosmetic differences with no functional effect: log tags, string prefixes, comments, internal type names.
- Threading/dispatch-queue or concurrency-model plumbing, unless it changes what the app can observe (e.g. sync vs callback-only vs async/await availability is in scope; internal queue hopping is not).
- Test coverage or missing tests.
- Build tooling, packaging, or distribution mechanics (CocoaPods vs SPM, npm vs yarn, etc.) unless they change what the app-facing API looks like.

## Format: tables only

Every area section — **no exception** — is a markdown table (`Capability | <SDK A label> | <SDK B label> | Classification`), never prose bullets. A cell with nothing to report is literally `Absent`, not an omitted row. If updating an existing doc and a section was previously written as bullets, convert it to a table as part of the update even when the underlying content is unchanged.

## Areas to compare

Derive the actual list from what each SDK really implements — this is a checklist to consider, not a fixed ceiling. Drop an area that doesn't apply to either SDK; add one this list doesn't foresee if the SDKs have it.

1. **Client creation & initialization** (compare this first, always) — how the app constructs the client: constructor/factory signature, required vs optional config (vault ID, vault URL, credentials/token provider, environment/log-level, any other init options), what validation happens at construction time and how a bad config surfaces (thrown error vs returned nil vs deferred failure on first call), and whether client creation is sync or async in each SDK.
2. **Container / element creation** — how collect and reveal elements are created (`create`, `container`, or equivalent), what element types exist, required vs optional per-element config, and any client-side validation attached at creation time (format/mask, custom validators, cross-field rules).
3. **Collect / insert-update** — request configuration (batching, additional fields, upsert options), response shape (what fields the app gets back per record), partial-batch failure visibility, and whether an equivalent call succeeds or fails for the same input.
4. **Reveal / detokenize** — request configuration (redaction/format options and how they validate), response shape, and whether the app can ever receive a sensitive plaintext value versus always getting a masked/tokenized result.
5. **Callbacks / async surface** — typed vs untyped success/failure shapes, and what async idioms exist (callback, Promise/Future, async/await, Combine/RxJava/Coroutines-equivalent).
6. **Error handling** — error type hierarchy, what information an error carries (code, message, underlying cause), and whether errors are typed or stringly-typed.
7. **Mocking / masking opt-ins** — any feature (like this repo's CVV mock-value replacement) where the SDK deliberately substitutes or withholds a real value from the app; compare whether it exists, how it's enabled, and what the substituted value is.
8. **Validation** — what input succeeds or fails for an equivalent call, not how the validator is implemented internally.
9. **Styling / UI configuration** (for UI-rendering SDKs) — theming, custom views, layout config exposed to the app.
10. **Any other public capability** found during the full-surface walk that doesn't fit the above — give it its own section rather than forcing it into a mismatched one.

## Steps

1. For each area, read the actual source in both cloned SDKs — never rely on memory of what a similarly-named SDK "usually" does.
2. Walk each SDK's public entry point outward (every public class/method/property/config option it exposes) at least once, independent of the operation-level areas above, so a whole capability area implemented only on one side isn't missed just because the other side has nothing that looks like it.
3. For each area, describe what an app developer can do differently: what's callable, what's configurable, what's returned, whether an equivalent call succeeds or fails. Apply the in-scope/out-of-scope test before writing a row down.
4. Classify every row:
   - ⚠️ **Surprising/breaking** — an app porting between the two SDKs could silently get different observable behavior for what looks like the same call.
   - ℹ️ **Expected/versioned** — a deliberate difference (different backend/contract/generation) — not a bug, just something to know.
   - ✅ **Identical** — the public-facing behavior really is the same — state this explicitly rather than omitting the row.
5. Cite the exact file:line backing each finding, for both SDKs (path relative to each clone's SDK root).
6. Do not modify any source code in either clone — this command only produces the doc.
7. Do not mention test coverage or missing tests anywhere in the doc.
8. Clean up: remove the scratch clone directory once the doc is written, unless the user asked to keep it for further inspection — say explicitly in your final message whether it was removed or where it was left.

## Output

Write to `docs/compare-sdks-<labelA>-vs-<labelB>.md`, so different comparisons get their own doc rather than overwriting each other.

- If the target file doesn't exist, create it with a top-level heading, a one-line note on both sources (URL, ref, subdirectory, detected language) and the date, then one section per area.
- If it exists, replace only the sections for areas covered by this run — leave unrelated sections untouched.
- End with a "Migration watch-outs" list: a concrete, ranked list of what a team porting an app from SDK A to SDK B (or maintaining both side by side) needs to know, most-likely-to-bite-first at the top — functional/feature items only. If nothing rises to that level, say so explicitly.

```
# SDK Comparison — <SDK A label> vs <SDK B label>

Compares `<SDK A url>@<ref>` (`<subdir or "repo root">`, <language>) against `<SDK B url>@<ref>` (`<subdir or "repo root">`, <language>). Generated <date>.

### Client creation & initialization
| Capability | <SDK A label> | <SDK B label> | Classification |
|---|---|---|---|
| ... | Present — <one-line note, file:line> / Absent | Present — <one-line note, file:line> / Absent | ⚠️ / ℹ️ / ✅ <reasoning> |

### <Area>
| Capability | <SDK A label> | <SDK B label> | Classification |
|---|---|---|---|
| ... | ... | ... | ⚠️ / ℹ️ / ✅ <reasoning> |

---
## Migration watch-outs
<ranked list, or "none identified">
```
