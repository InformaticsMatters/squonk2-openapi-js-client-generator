import type { Options } from "tsup";

export const tsup: Options = {
  dts: true,
  minify: false,
  splitting: true,
  sourcemap: true,
  clean: false,
  format: ["esm", "cjs"],
  entryPoints: ["src/index.ts", "src/*/*.ts"],
  target: "es2022",
  onSuccess: "node setup-entrypoints.js",
};
