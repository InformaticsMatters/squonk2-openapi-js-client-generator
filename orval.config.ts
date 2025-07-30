import { defineConfig } from "orval";

export default defineConfig({
  // ORVAL_API_NAME below is replaced in the action
  ORVAL_API_NAME: {
    input: { target: "./openapi.yaml", validation: false },
    output: {
      mode: "tags-split",
      // API_TARGET_NAME below is replaced in the action
      target: "./src/API_TARGET_NAME.ts",
      client: "react-query",
      override: {
        operationName: (operation) => operation["x-semantic-name"],
        mutator: { path: "./src/custom-instance.ts", name: "customInstance" },
        query: { useQuery: true, useSuspenseQuery: true },
      },
    },
    hooks: {
      afterAllFilesWrite: [
        { command: "node morph-query-keys.js API_TARGET_NAME", injectGeneratedDirsAndFiles: false },
        { command: "prettier --ignore-path .prettierignore --write" },
      ],
    },
  },
});
