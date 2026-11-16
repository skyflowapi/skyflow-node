#!/usr/bin/env node
/**
 * Finalize the published declaration file of one SDK package.
 *
 * `build:dist` runs tsup (which emits dist/index.d.ts still importing the private
 * `skyflow-common` workspace package) and then api-extractor's dtsRollup (which
 * writes a self-contained dist/index.rollup.d.ts with skyflow-common inlined).
 * This script replaces dist/index.d.ts with that rollup so the tarball ships a
 * declaration file consumers can resolve without skyflow-common.
 *
 * The rollup also carries the generated REST client's namespace re-exports
 * (`export declare namespace stringsV2 { ... }` etc.) because the public Detect
 * types reference them. They are implementation detail, so the `export` is
 * dropped to keep them out of the public API surface.
 *
 * Run from the package directory: `node ../scripts/finalize-dts.js`
 */
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), 'dist');
const rollup = path.join(distDir, 'index.rollup.d.ts');
const target = path.join(distDir, 'index.d.ts');

if (!fs.existsSync(rollup)) {
  console.error(`finalize-dts: ${rollup} not found; run api-extractor with api-extractor-dts.json first`);
  process.exit(1);
}

let text = fs.readFileSync(rollup, 'utf8');
if (/from ['"]skyflow-common['"]/.test(text)) {
  console.error('finalize-dts: rollup still imports skyflow-common; check bundledPackages in api-extractor.json');
  process.exit(1);
}

const before = (text.match(/^\s*export declare namespace /gm) || []).length;
text = text.replace(/^(\s*)export declare namespace /gm, '$1declare namespace ');

fs.writeFileSync(target, text);
fs.unlinkSync(rollup);
console.log(`finalize-dts: wrote ${path.relative(process.cwd(), target)} (${before} generated namespace export(s) made internal)`);
