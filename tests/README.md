# Type Safety Tests

This directory contains example type-level tests for the generated OpenAPI client to ensure type safety and correct inference.

**Note:** These tests are examples that use the Data Manager API (`openapi.yaml`). To use these tests, you'll need to:

1. Have the Data Manager OpenAPI spec as `openapi.yaml` in the project root
2. Generate the client with `pnpm orval`
3. Then run `pnpm test`

For other OpenAPI specs, use these tests as a template and adapt the imports and type names to match your generated client.

## Test Files

### `type-tests.tsx`

Pure type-level tests that verify:

- queryKey is optional in query options
- select callbacks properly infer types
- Parameter requirements are enforced
- Query options type checking
- TData generic inference with and without select
- Error types
- Request options

These tests use `@ts-expect-error` annotations to verify that invalid code is correctly rejected by TypeScript.

### `react-component-tests.tsx`

React component examples that test:

- Basic query usage in components
- Data transformation with select
- Conditional queries (enabled prop)
- Custom queryKeys
- Mutations (create, delete)
- Multiple queries in one component
- Query parameters
- Complex select transformations
- Error handling
- Dependent queries

## Running Tests

### Type Check Only

```bash
# Check all tests
pnpm run test:types
```

### With Generated Client

```bash
# 1. Ensure you have openapi.yaml with Data Manager API spec
# 2. Generate the client
pnpm orval

# 3. Run type checks
pnpm test
```

## What These Tests Verify

1. **queryKey Optional**: Orval correctly detects React Query v5 and generates `Partial<UseQueryOptions>`, making queryKey optional
2. **Type Inference**: Select callbacks properly transform data types - return type inferred from select function
3. **Parameter Safety**: Required parameters are enforced at compile time
4. **React Query v5**: All v5 options available (gcTime, not cacheTime)
5. **Invalid Options Rejected**: TypeScript catches typos and invalid options in query configuration
6. **No Runtime Tests**: These are compile-time only - we trust React Query's runtime behavior

## Why This Matters

The root cause of the type issues was the peerDependency range `>=4` in package.json. This made Orval unable to definitively detect React Query v5, so it generated hooks for v4 which don't use `Partial<UseQueryOptions>`. This caused:

- queryKey to be required (React Query v5 has it as the 4th generic parameter in UseQueryOptions)
- select callbacks to have incorrect type inference

By setting peerDependencies to `>=5`, Orval correctly detects v5 and generates the proper types.

## Adapting These Tests

These example tests import from `../src/api/job/job` and use Data Manager API types. To use them with your OpenAPI spec:

1. Update imports to match your generated API structure (e.g., `../src/api/your-endpoint/your-endpoint`)
2. Replace type names with types from your spec (e.g., replace `JobsGetResponse` with your response types)
3. Update parameter names and structures to match your API
4. Keep the same test patterns - they verify the core type safety features

## Adding New Tests

When adding new tests:

1. Name test functions descriptively (e.g., `TestQueryKeyOptional`)
2. Use `@ts-expect-error` to verify invalid code is rejected
3. Add comments explaining what's being tested
4. Keep tests focused on type safety, not runtime behavior
