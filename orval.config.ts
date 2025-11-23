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
          queryOptions: { path: "./src/options-mutator.ts", name: "queryMutator" },
          mutationOptions: { path: "./src/options-mutator.ts", name: "mutationMutator" },
        },
      },
    },
    hooks: { afterAllFilesWrite: [{ command: "prettier --ignore-path .prettierignore --write" }] },
  },
});
