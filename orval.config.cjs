module.exports = {
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
      client: 'react-query',
      override: {
        operationName: (operation) => operation["x-semantic-name"] || operation.operationId,
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
        },
      },
    },
  },
};
