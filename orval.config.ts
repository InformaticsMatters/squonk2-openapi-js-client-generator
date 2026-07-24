import { defineConfig } from "orval";

const openapiInput = process.env.OPENAPI_INPUT || "./openapi.yaml";

export default defineConfig({
  zod: {
    input: { target: openapiInput, unsafeDisableValidation: true },
    output: { client: "zod", mode: "tags-split", target: "./src/api", fileExtension: ".zod.ts" },
  },
  fetch: {
    input: { target: openapiInput, unsafeDisableValidation: true },
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
        aliasCombinedTypes: false,
        query: { useSuspenseQuery: true, useInvalidate: true, shouldSplitQueryKey: true },
      },
    },
  },
  axios: {
    input: { target: openapiInput, unsafeDisableValidation: true },
    output: {
      mode: "tags-split",
      target: "./src/api",
      schemas: "./src/api/api-schemas",
      client: "react-query",
      httpClient: "axios",
      override: {
        operationName: (operation) => operation["x-semantic-name"],
        mutator: { path: "./src/custom-axios.ts", name: "customInstance" },
        aliasCombinedTypes: false,
        query: { useSuspenseQuery: true, useInvalidate: true, shouldSplitQueryKey: true },
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
