#!/usr/bin/env bash
# Summarise how each SDK's public API surface changed relative to the PR's base
# branch, as Markdown for a PR comment and the job summary.
#
# For each published package it diffs the base branch's committed api-report
# against the surface regenerated from this PR's code (temp/, written by
# `api-extractor run`). Using the regenerated file means the comment is right
# even when the PR forgot to re-baseline the committed snapshot; that case is
# called out separately.
#
# Usage: api-surface-diff.sh <base-ref> <output.md>
#   base-ref   e.g. origin/main (must already be fetched)
#   output.md  where to write the Markdown
set -uo pipefail

BASE_REF="${1:?usage: api-surface-diff.sh <base-ref> <output.md>}"
OUT="${2:?usage: api-surface-diff.sh <base-ref> <output.md>}"

# Keep the comment under GitHub's 65,536-character limit.
MAX_DIFF_LINES_PER_PACKAGE=350

# name | committed report | regenerated report | legacy path of the report on
# pre-split base branches (main still has the skyvault report at the repo root)
PACKAGES=(
  "skyflow-node|skyvault/api-report/skyflow-node.api.md|skyvault/temp/skyflow-node.api.md|api-report/skyflow-node.api.md"
  "skyflow-flowvault-node|flowvault/api-report/skyflow-flowvault-node.api.md|flowvault/temp/skyflow-flowvault-node.api.md|"
)

{
  echo "<!-- api-surface-diff -->"
  echo "## Public API surface changes"
  echo ""
  echo "Compared with \`${BASE_REF#origin/}\`. In the diffs, \`-\` lines were removed"
  echo "from the public API and \`+\` lines were added. Removals and signature"
  echo "changes are breaking for consumers."
  echo ""
} > "$OUT"

any_changes=0
stale_snapshot=0

for entry in "${PACKAGES[@]}"; do
  IFS='|' read -r name report temp legacy <<< "$entry"

  # Prefer the regenerated surface; fall back to the committed snapshot if the
  # build never got that far.
  current="$temp"
  if [ ! -f "$current" ]; then
    current="$report"
  fi
  if [ ! -f "$current" ]; then
    {
      echo "### $name"
      echo ""
      echo "No API report was produced for this package (the build failed before api-extractor ran)."
      echo ""
    } >> "$OUT"
    continue
  fi

  if [ -f "$temp" ] && [ -f "$report" ] && ! cmp -s "$temp" "$report"; then
    stale_snapshot=1
  fi

  base_file="$(mktemp)"
  base_note=""
  if git cat-file -e "$BASE_REF:$report" 2>/dev/null; then
    git show "$BASE_REF:$report" > "$base_file"
  elif [ -n "$legacy" ] && git cat-file -e "$BASE_REF:$legacy" 2>/dev/null; then
    git show "$BASE_REF:$legacy" > "$base_file"
    base_note=" _(base report read from its old location \`$legacy\`)_"
  else
    : > "$base_file"
    base_note=" _(no report on the base branch, so every line is new)_"
  fi

  diff_out="$(diff -u --label "base/$name.api.md" --label "pr/$name.api.md" "$base_file" "$current" || true)"
  rm -f "$base_file"

  if [ -z "$diff_out" ]; then
    {
      echo "### $name: no changes"
      echo ""
    } >> "$OUT"
    continue
  fi

  any_changes=1
  added="$(printf '%s\n' "$diff_out" | grep -cE '^\+[^+]' || true)"
  removed="$(printf '%s\n' "$diff_out" | grep -cE '^-[^-]' || true)"
  total_lines="$(printf '%s\n' "$diff_out" | wc -l | tr -d ' ')"

  {
    echo "### $name: ${added} added, ${removed} removed${base_note}"
    echo ""
    echo "<details><summary>Show diff</summary>"
    echo ""
    echo '```diff'
    printf '%s\n' "$diff_out" | head -n "$MAX_DIFF_LINES_PER_PACKAGE"
    if [ "$total_lines" -gt "$MAX_DIFF_LINES_PER_PACKAGE" ]; then
      echo ""
      echo "... $((total_lines - MAX_DIFF_LINES_PER_PACKAGE)) more lines. The full reports are in the \`api-surface-reports\` workflow artifact."
    fi
    echo '```'
    echo ""
    echo "</details>"
    echo ""
  } >> "$OUT"
done

if [ "$stale_snapshot" -eq 1 ]; then
  {
    echo "> **Snapshot out of date.** The committed \`api-report\` does not match the"
    echo "> API this PR builds, so the Contract Tests check fails. If the change is"
    echo "> intended, run \`npm run contract-snapshot\` and commit the updated reports."
    echo ""
  } >> "$OUT"
fi

if [ "$any_changes" -eq 0 ]; then
  {
    echo "No public API changes in this PR."
    echo ""
  } >> "$OUT"
fi
