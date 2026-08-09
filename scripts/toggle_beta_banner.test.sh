#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOGGLE="$SCRIPT_DIR/toggle_beta_banner.sh"
FIXTURE="$(mktemp)"
MARKER_START="<!-- SKYFLOW-BETA-DISCLAIMER:START -->"
BANNER_TEXT="> ⚠️ **Beta release — not for production use.** This is a pre-release build provided for early testing and feedback. It has not completed Skyflow's General Availability (GA) validation, its API may change before the stable release, and it is not covered by production SLAs or support commitments. Do not deploy beta builds to production environments."

fail() {
    echo "FAIL: $1"
    rm -f "$FIXTURE"
    exit 1
}

cat > "$FIXTURE" <<'EOF'
# Skyflow Node.js SDK

Securely handle sensitive data intro text.
EOF

# Test 1: Banner is inserted for beta version
"$TOGGLE" "$FIXTURE" "2.2.0-beta.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 1 ] || fail "banner marker not inserted for beta version"
grep -qF "$BANNER_TEXT" "$FIXTURE" || fail "banner text not found in file"
[ "$(head -n 1 "$FIXTURE")" = "# Skyflow Node.js SDK" ] || fail "title moved after banner insertion"

# Test 2: Banner is not duplicated on repeat run
"$TOGGLE" "$FIXTURE" "2.2.0-beta.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 1 ] || fail "banner duplicated on repeat run"
grep -qF "$BANNER_TEXT" "$FIXTURE" || fail "banner text lost after second run"

# Test 3: Banner is removed for GA version
"$TOGGLE" "$FIXTURE" "2.2.0"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 0 ] || fail "banner not removed for GA version"
[ "$(head -n 1 "$FIXTURE")" = "# Skyflow Node.js SDK" ] || fail "title missing after banner removal"

# Test 4: Original README content is preserved
grep -qF "intro text." "$FIXTURE" || fail "original README content lost"

rm -f "$FIXTURE"
echo "PASS: toggle_beta_banner.sh"
