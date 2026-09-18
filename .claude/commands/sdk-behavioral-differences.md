Generate or update a doc describing user-exposed functionality and feature differences between two SDKs (e.g. an older and newer generation of the same SDK), in any language. Argument: $ARGUMENTS

## Getting the two SDKs to compare

$ARGUMENTS may specify, for each SDK being compared:
- a source directory path (any language), or
- one or more labeled fenced code blocks with that SDK's actual source (for an SDK not checked out in this repo — e.g. ` ```kotlin ... ``` `), plus
- an optional short label for each SDK to use in headings (e.g. "legacy" / "v2", or version numbers).

Never invent or recall another SDK's shape or behavior from memory — read the directory or use exactly what was pasted.

### Auto-detecting the two SDKs when $ARGUMENTS doesn't name them

Don't default to any hardcoded folder name — detect the pair from the repo itself:

1. Check the package manifest(s) for a multi-target/multi-product setup: SwiftPM `Package.swift`'s `products` array, `package.json` workspaces, `settings.gradle`/`settings.gradle.kts` `include(...)`, `Cargo.toml` `[workspace] members`, `pyproject.toml`/`setup.cfg` multiple packages, one `*.podspec`/`*.gemspec` per library, `pom.xml` `<modules>`. Each declared library/module is a candidate SDK.
2. If that doesn't cleanly yield candidates, fall back to scanning top-level directories for ones that each have their own source root (`Sources/`, `src/`, `lib/`) and their own build/manifest file — treat each as a candidate SDK.
3. Narrow to exactly two candidates that look like "the same SDK, two generations/flavors" rather than two unrelated libraries — e.g. they share a common internal module/dependency, or their names/descriptions clearly pair up (legacy/next, v1/v2, GA/beta).
4. Determine which of the two is older vs newer using whatever signal actually exists — don't guess if it's unclear: explicit version/generation naming (`v1`/`v2`, `legacy`/`next`), README/CHANGELOG/manifest language ("deprecated", "GA" vs "Beta", "legacy"), or git history (`git log --diff-filter=A --follow --format=%ad -- <dir>` — the directory with the earlier oldest commit is the older SDK).
5. If you can't confidently narrow to exactly two SDK directories, or can't tell which is older, **stop and ask the user** rather than guessing — state what candidates you found and why it's ambiguous.
6. State the auto-detected paths and labels explicitly in the doc's header, exactly as if they'd been passed as an argument, so a wrong detection is visible at a glance and easy to correct on the next run.

Determine each SDK's language from whatever is most explicit: what the user stated, the dominant file extension in its directory, or the fenced code block's language tag.

If the two SDKs share a common underlying module (as this repo's two Swift SDKs share `SkyflowCore/Sources/` via Swift's `package` access level), identify it: logic both SDKs delegate to unmodified is identical by construction, and stating that explicitly lets the investigation focus on where behavior can actually diverge — each SDK's own top-level source. If the two SDKs don't share any such module (e.g. two independently-shipped SDKs, or different languages entirely), skip this step and compare full behavior directly.

## Scope: public-surface functionality only

This doc is about what an app developer integrating either SDK can actually **do, configure, or observe** through the public API — not internal implementation detail. For every candidate finding, ask: "would an app developer notice this without reading the SDK's source?" If the answer is no, it doesn't belong in this doc. Concretely:

**In scope:**
- A method/capability that exists in one SDK's public API and not the other.
- A parameter, option, or config value that one SDK accepts and the other doesn't, or that changes what you can express (e.g. a single-value option becoming a richer typed option).
- A difference in what data the app receives back through the public API (e.g. whether a sensitive value is ever exposed, whether a partial-batch failure surfaces per-item).
- A difference in whether an equivalent public call succeeds or fails for the same input.

**Out of scope — do not include:**
- Raw wire/payload key naming or casing, unless the app's public callback literally hands that raw payload to the app and the key difference changes what the app can read from it.
- Internal implementation quality (crash risk, code robustness, algorithmic detail) that isn't a deliberate functional/feature difference.
- Cosmetic differences with no functional effect: log tags, string prefixes in messages, comments, internal type names.
- Threading/dispatch-queue or concurrency-model behavior.
- Test coverage or missing tests.

## Format: tables only

Every area section in this doc — **Feature availability included, with no exception** — is a markdown table (`Capability | <SDK A label> | <SDK B label> | Classification`), never a prose bullet list, even when a whole area is one SDK's capabilities vs the other's. A cell that has nothing to report is literally `Absent`, not an omitted row. This applies equally when updating an existing doc: if a section you're touching this run was previously written as bullets (an earlier generation may have drifted from this format), convert it to a table as part of the update even if the underlying content isn't changing.

## Areas to compare

1. **Feature availability** — enumerate capabilities that exist in only one SDK's public API at all. Diff the file/type lists of the two source directories (e.g. `find <dirA> -name "*.<ext>"` vs `find <dirB> -name "*.<ext>"`, using each SDK's actual extension) to catch this systematically, then confirm each candidate is actually public/exported (or otherwise app-reachable — `public` in Swift/Kotlin/Java/C#, `export` in TypeScript, no leading underscore in Python, an exported/capitalized identifier in Go) before listing it — an internal-only type with no public entry point isn't a user-facing feature difference. Present this as a `Capability | <SDK A label> | <SDK B label> | Classification` table per the Format rule above (each side's cell is either a one-line description with its citation, or "Absent"). **A file-list diff only catches capabilities unique to one side — it will silently miss an entire capability area that both SDKs implement identically via shared/inherited code, because identical files don't show up in a diff.** That's what step 2 is for.
2. **Full public-surface inventory (do this before finalizing the area list)** — for each SDK, start from its top-level public entry point(s) (main class/module and everything it re-exports) and walk outward: every public method, property, static/enum member, config option, event/callback, and (for a UI-rendering SDK) component/element lifecycle hook that an app can call, set, or observe. Do this for the full surface, not just the parts that looked interesting during the operation-level read in step 3 — a capability area that's entirely inherited unmodified from a shared module by both SDKs is exactly the kind of thing an operation-focused read skips, and it still belongs in the doc as an explicit ✅-classified section (per the classification rule below) so a reader isn't left wondering whether it was checked at all. Concretely, beyond the request/response operations in step 3, expect areas like: component/element lifecycle (create/mount/unmount/update/destroy, state introspection), an event or callback/listener system (what events exist, what payload each carries, whether unsubscribe exists), client-side validation rules an app can attach (including any cross-field/cross-element rules), styling/theming/UI configuration, session/init config beyond bare authentication (log level, environment/mode switches, custom endpoints, feature flags), and any telemetry/analytics opt-in. Treat this as a checklist to consider for any SDK shape, not a ceiling — derive the actual area list from what each SDK actually implements, and drop items that don't apply (e.g. no event system exists) rather than forcing a section.
3. **Request/response operations** — derive the operation-level areas from what the two SDKs actually implement (don't assume a fixed list). For a Skyflow SDK specifically, expect: collect/insert-update (request configuration, response shape, partial-failure visibility), reveal/detokenize (can the app ever receive a sensitive plaintext value, redaction options and their validation), error handling/callback shape (typed vs untyped), any mocking/masking opt-in features, and validation (what input succeeds or fails for an equivalent call, not how the validator is implemented). Group findings under one heading per operation area.

## Steps

1. For each area, read both SDKs' source. Where both delegate to shared underlying code identified above, behavior is identical by construction — state that explicitly rather than re-deriving it, and spend the investigation on each SDK's own layer, where behavior can actually diverge.
2. For each area, describe what an app developer can do differently: what's callable, what's configurable, what's returned, and whether an equivalent call succeeds or fails. Before writing a finding down, apply the in-scope/out-of-scope test above — drop it if it's implementation-only.
3. Classify every difference found:
   - ⚠️ **Surprising/breaking** — an app porting between the two SDKs could silently get different observable behavior for what looks like the same call.
   - ℹ️ **Expected/versioned** — a deliberate difference because the newer SDK targets a different backend/contract with genuinely different semantics — not something to fix, just something to know.
   - ✅ **Identical** — the public-facing behavior really is the same — state this explicitly so the area isn't left as an open question.
4. **An area doesn't need a difference to earn a section.** If the full public-surface inventory (step 2 above) turns up a whole capability area that both SDKs implement identically via shared code, write it up as its own section with every row classified ✅ and a one-line note on why (e.g. "inherited unmodified from `<shared module>`, no per-SDK override exists"). Skipping it because "nothing diverged" is exactly the gap this step exists to prevent — the doc's job is coverage of the full user-facing surface, not just a diff of where the two SDKs disagree.
5. Cite the exact file:line backing each difference, for both SDKs.
6. Do not modify any source code in this pass — this command only produces the doc.
7. Do not mention test coverage or missing tests anywhere in the doc.

## Output

Write to `docs/sdk-behavioral-differences.md` when the pair being compared was auto-detected (no SDKs named in $ARGUMENTS) or matches whatever pair a prior run in this repo already used. If $ARGUMENTS explicitly names a different pair (e.g. comparing against a pasted external SDK, or a third SDK in a repo with more than two), write to `docs/sdk-behavioral-differences-<labelA>-vs-<labelB>.md` instead, so different comparisons get their own doc rather than overwriting each other.

- If the target file doesn't exist, create it with a top-level heading, a one-line note on which two SDKs (source paths/labels/languages) were compared and the date, then one section per area.
- If it exists, replace only the sections for areas covered by this run — leave unrelated sections untouched.
- End with a "Migration watch-outs" list: a concrete, ranked list of what a team porting an app from SDK A to SDK B (or maintaining both side by side) needs to know, most-likely-to-bite-first at the top — only functional/feature items, per the scope above. If nothing rises to that level, say so explicitly.

```
# SDK Behavioral Differences — <SDK A label> vs <SDK B label>

Compares `<SDK A source>` against `<SDK B source>` (shared behavior via `<shared module>` noted where relevant, if any). Scope: user-exposed functionality/feature differences only — not internal implementation detail. Generated <date>.

### Feature availability
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
