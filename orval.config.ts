import { defineConfig } from 'orval';

export default defineConfig({
  // ORVAL_API_NAME below is replaced in the action
  ORVAL_API_NAME: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      // API_TARGET_NAME below is replaced in the action
      target: './src/API_TARGET_NAME.ts',
      prettier: true,
      client: 'axios',
      override: {
        // mutator: {
        //   path: './src/custom-instance.ts',
        //   name: 'customInstance',
        // },
        query: {
          useQuery: true,
        },
      },
    },
  },
})
