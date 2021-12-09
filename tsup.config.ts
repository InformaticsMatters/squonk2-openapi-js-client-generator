import type { Options } from 'tsup';

export const tsup: Options = {
  dts: true,
  minify: false,
  splitting: false,
  sourcemap: 'external',
  clean: true,
  format: ['esm', 'cjs'],
  entryPoints: ['src/index.ts', 'src/*/*.ts'],
  target: 'node16',
};
