# Action to Generate and Publish a TS Client & Docs from an OpenAPI File

## Generator

Generate a React / TypeScript client from an OpenAPI file. [Orval](https://orval.dev) is used to generate a client from the tagged OpenAPI file. This is fully typed and provides functions to make API calls along with [@tanstack/react-query](https://tanstack.com/query) hooks for queries and mutations. Axios is used to make HTTP calls.

The `operationId`s can be replaced with more useful names by specifying an `x-semantic-name` field alongside the `operationId`. These no longer need to be globally unique (like the operationId does) but still need to be unique within a `tag` to avoid name clashes.

## Build

The source client is built using [tsdown](https://tsdown.dev). Both CommonJS and ESM outputs are provided. To allow efficient tree-shaking and bundling, each `tag` from the OpenAPI file is provided in its own submodule as its own entry-point.

## Query Key Prefixing

To prevent cache collisions when multiple API clients are used in the same application, query keys are automatically prefixed with the API name. This is handled by a post-processing script (`morph-query-keys.ts`) that runs after code generation. The prefix is extracted from the package name (e.g., `@squonk/account-server-client` → `"account-server"`).

## Package Structure

### Primary entry-point `@org/service-client`:

- The `customInstance` used to make calls is exported for cases where the generated API doesn't provide certain features.
- All TypeScript types generated from the OpenAPI spec are exported from here. Import types separately using `import type {} from '@squonk/service-client'`.

### Sub-entry points (e.g., `@squonk/service-client/accounting`):

Each OpenAPI tag is available as a submodule, exporting:

- **Query hooks**: `use{OperationName}` (e.g., `useGetAccountServerNamespace`) with prefixed query keys
- **Suspense query hooks**: `use{OperationName}SuspenseQuery` for use with React `<Suspense>` boundaries
- **Mutation hooks**: `use{OperationName}` for POST/PUT/DELETE operations
- **Query key helpers**: `get{OperationName}QueryKey()` returns the prefixed query key used by the hook (e.g., `["account-server", "getAccountServerNamespace"]`)
- **Invalidate helpers**: `useInvalidate{OperationName}()` returns a function to invalidate the query cache

Operation names come from the `x-semantic-name` fields specified in the OpenAPI spec.

## Current Clients

- [Data Manager Client](https://www.npmjs.com/package/@squonk/data-manager-client)
- [Account Server Client](https://www.npmjs.com/package/@squonk/account-server-client)
