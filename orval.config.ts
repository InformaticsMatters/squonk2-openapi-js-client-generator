import { defineConfig } from "orval";

export default defineConfig({
  zod: {
    input: { target: "./openapi.yaml", validation: false },
    output: { client: "zod", mode: "tags-split", target: "./src/api", fileExtension: ".zod.ts" },
  },
  fetch: {
    input: { target: "./openapi.yaml", validation: false },
    output: {
      clean: true,
      mode: "tags-split",
      target: "./src/api",
      schemas: "./src/api/api-schemas",
      fileExtension: ".fetch.ts",
      client: "react-query",
      httpClient: "fetch",
      override: {
        operationName: (operation) => operation["x-semantic-name"],
        mutator: { path: "./src/custom-fetch.ts", name: "customFetch" },
        query: {
          useQuery: true,
          useSuspenseQuery: true,
          useInvalidate: true,
          shouldSplitQueryKey: true,
        },
      },
    },
  },
  axios: {
    input: { target: "./openapi.yaml", validation: false },
    output: {
      mode: "tags-split",
      target: "./src/api",
      schemas: "./src/api/api-schemas",
      client: "react-query",
      httpClient: "axios",
      override: {
        operationName: (operation) => operation["x-semantic-name"],
        mutator: { path: "./src/custom-axios.ts", name: "customInstance" },
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
