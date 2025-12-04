import { defineConfig } from "orval";

export default defineConfig({
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
        { command: "prettier --ignore-path .prettierignore --write" },
      ],
    },
  },
});
