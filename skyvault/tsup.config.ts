import { defineConfig } from 'tsup';

// Bundles the published entry, inlining the private `skyflow-common` workspace
// package so the tarball is self-contained (no skyflow-common dependency ships).
// Real npm dependencies stay external (declared in package.json "dependencies").
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['cjs'],
  outDir: 'dist',
  target: 'es2019',
  platform: 'node',
  noExternal: ['skyflow-common'],
  tsconfig: 'tsconfig.dts.json',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  shims: false,
});
