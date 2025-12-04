import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/api/*/*.ts", "src/api/*/*.zod.ts"],
  dts: true,
  format: ["cjs", "esm"],
  target: "es2022",
  platform: "neutral",
  sourcemap: true,
  unbundle: true,
  external: ["@tanstack/react-query", "axios", "zod"],
  exports: {
    customExports(pkg, context) {
      // Create simplified export paths for API modules (e.g., "./accounting" instead of "./api/accounting/accounting")
      // Dynamically discovers modules from build output and includes proper type definitions for both ESM and CJS

      // Extract module names from the build chunks
      const modules = new Set<string>();

      // Get chunks from all formats and extract module names
      for (const format in context.chunks) {
        const chunks = context.chunks[format as keyof typeof context.chunks];
        if (chunks) {
          for (const chunk of chunks) {
            if (chunk.type === "chunk" && chunk.fileName) {
              // Match pattern: api/{moduleName}/{moduleName}.js (or .cjs) and api/{moduleName}/{moduleName}.zod.js
              const match = chunk.fileName.match(/^api\/([^/]+)\/\1\.(js|cjs)$/);
              if (match && match[1]) {
                modules.add(match[1]);
              }
            }
          }
        }
      }

      // For each module, create simplified export paths for both regular and zod files
      for (const moduleName of modules) {
        // Regular exports
        pkg[`./${moduleName}`] = {
          import: {
            types: `./dist/api/${moduleName}/${moduleName}.d.ts`,
            default: `./dist/api/${moduleName}/${moduleName}.js`,
          },
          require: {
            types: `./dist/api/${moduleName}/${moduleName}.d.cts`,
            default: `./dist/api/${moduleName}/${moduleName}.cjs`,
          },
        };

        // Zod exports
        pkg[`./${moduleName}/zod`] = {
          import: {
            types: `./dist/api/${moduleName}/${moduleName}.zod.d.ts`,
            default: `./dist/api/${moduleName}/${moduleName}.zod.js`,
          },
          require: {
            types: `./dist/api/${moduleName}/${moduleName}.zod.d.cts`,
            default: `./dist/api/${moduleName}/${moduleName}.zod.cjs`,
          },
        };
      }

      return pkg;
    },
  },
});
