#!/usr/bin/env bash
#
# Bump the version of one published SDK in the monorepo.
#
# Usage:
#   bump_version.sh <product> <version> [sha]
#
#   <product>  skyflow-node            -> bumps skyvault/package.json
#              skyflow-flowvault-node  -> bumps flowvault/package.json
#   <version>  semver, e.g. 2.1.3 or 1.0.0
#   [sha]      optional short commit SHA; when present the version becomes
#              "<version>-dev.<sha>" (internal/JFrog pre-release builds)
#
set -euo pipefail

PRODUCT=$1
SEMVER=$2
SHA=${3:-}

case "$PRODUCT" in
  skyflow-node)
    PKG_DIR="skyvault"
    ;;
  skyflow-flowvault-node)
    PKG_DIR="flowvault"
    ;;
  *)
    echo "Unknown product '$PRODUCT'. Expected 'skyflow-node' or 'skyflow-flowvault-node'." >&2
    exit 1
    ;;
esac

PKG_JSON="$PKG_DIR/package.json"

if [ ! -f "$PKG_JSON" ]; then
  echo "Cannot find $PKG_JSON" >&2
  exit 1
fi

if [ -z "$SHA" ]; then
  TARGET="$SEMVER"
else
  TARGET="$SEMVER-dev.$SHA"
fi

echo "Bumping $PRODUCT ($PKG_JSON) to $TARGET"

# Replace only the first "version" line (the package's own version field).
sed -E "0,/\"version\": .+/s//\"version\": \"$TARGET\",/" "$PKG_JSON" > "$PKG_JSON.tmp" \
  && cat "$PKG_JSON.tmp" > "$PKG_JSON" \
  && rm -f "$PKG_JSON.tmp"

# Keep the in-source SDK version constant in sync (self-reported identity).
VERSION_TS="$PKG_DIR/src/version.ts"
if [ -f "$VERSION_TS" ]; then
  sed -E "s/export const SDK_VERSION = \".+\";/export const SDK_VERSION = \"$TARGET\";/" "$VERSION_TS" > "$VERSION_TS.tmp" \
    && cat "$VERSION_TS.tmp" > "$VERSION_TS" \
    && rm -f "$VERSION_TS.tmp"
  echo "Updated $VERSION_TS to $TARGET"
fi

echo --------------------------
echo "Done, $PRODUCT now at $TARGET"
