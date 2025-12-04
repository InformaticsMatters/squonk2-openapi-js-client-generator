import { defineConfig } from "orval";

export default defineConfig({
  zod: {
    input: { target: "./openapi.yaml", validation: false },
    output: { client: "zod", mode: "tags-split", target: "./src/api", fileExtension: ".zod.ts" },
  },
  api: {
    input: { target: "./openapi.yaml", validation: false },
    output: {
      mode: "tags-split",
      target: "./src/api/api.ts",
      client: "react-query",
      baseUrl: "",
      override: {
        operationName: (operation) => operation["x-semantic-name"],
        mutator: { path: "./src/custom-instance.ts", name: "customInstance" },
        query: {
          useQuery: true,
          useSuspenseQuery: true,
          useInvalidate: true,
          shouldSplitQueryKey: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: [
        {
          command: "node --experimental-strip-types morph-query-keys.ts",
          injectGeneratedDirsAndFiles: false,
        },
        {
          // format all generated files at the end rather than after each client
          command: "prettier --ignore-path .prettierignore --write src",
          injectGeneratedDirsAndFiles: false,
        },
      ],
    },
  },
});
