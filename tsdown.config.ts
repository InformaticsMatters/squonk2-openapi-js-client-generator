import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/api/*/*.ts"],
  dts: true,
  format: ["cjs", "esm"],
  target: "es2022",
  platform: "neutral",
  sourcemap: true,
  exports: true,
  unbundle: true,
});
