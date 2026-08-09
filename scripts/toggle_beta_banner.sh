#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 2 ]; then
    echo "Usage: toggle_beta_banner.sh <readme-path> <version>"
    exit 1
fi

README_PATH="$1"
VERSION="$2"
MARKER_START="<!-- SKYFLOW-BETA-DISCLAIMER:START -->"
MARKER_END="<!-- SKYFLOW-BETA-DISCLAIMER:END -->"
BANNER_TEXT="$MARKER_START
> **Note:** This is a beta release of the Skyflow Node.js SDK. APIs may change without notice.
$MARKER_END"

# Check if version contains "beta"
if [[ "$VERSION" =~ -beta ]]; then
    # Insert banner if it doesn't already exist
    if ! grep -q "^$MARKER_START" "$README_PATH"; then
        # Insert banner at the beginning of the file
        {
            echo "$BANNER_TEXT"
            echo ""
            cat "$README_PATH"
        } > "$README_PATH.tmp"
        mv "$README_PATH.tmp" "$README_PATH"
    fi
else
    # Remove banner if it exists
    if grep -q "^$MARKER_START" "$README_PATH"; then
        sed -i "/^$MARKER_START/,/^$MARKER_END/d" "$README_PATH"
        # Remove leading blank lines introduced by banner removal
        sed -i '/./,$!d' "$README_PATH"
    fi
fi
