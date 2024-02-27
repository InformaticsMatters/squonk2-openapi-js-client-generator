# Action to Generate and Publish a TS Client & Docs from an OpenAPI File

## Generator

Generate a React / TypeScript client from an OpenAPI file. [Orval](https://orval.dev) is used to generate a client from the tagged OpenAPI file. This is fully typed and provides functions to make API calls along with [react-query](https://react-query.tanstack.com/) hooks for _requests_ and _mutations_. Currently Axios is used to make calls but to support features such as Streams we might switch this in the future.

The `operationId`s can be replaced with more useful names by specifying a `x-sematic-name` field along side the `operationId`. These no longer need to be globally unique but still need to be within a `tag` to avoid a name clash.

## Build

The source client is then built using [tsup](https://tsup.egoist.sh/). Both CommonJS and ESM outputs are provided. To allow efficient tree-shaking and bundling, each `tag` from the OpenAPI file is provided in its own submodule as its own entry-point.

The exports can be accessed as follows:

### From the primary entry-point `@org/service-client`:

- The `customInstance` used to make calls is exported in the case where the exported API doesn't allow certain features.
- *All* the exported types are only exported from here (limited by the output of orval but you should import types separately with `import type {} from ''` regardless).

### From the sub-entry points, the `react-query` exports can be imported.

This will be the standard output of `Orval` with `react-query` These will be the `x-semantic-name` fields specified in the OpenAPI. In addition the hooks will of course be prefixed by `use` and converted to `camelCase`. Each `useQuery` hook will also have a `get${camelCase(operationId)}` function that takes the same request params and body to generate a query key. Additionally, suspense queries are generated for `<Suspense></Suspense>` boundaries.

## Docs

Docs can also be generated with [typedoc](https://typedoc.org/). The `./setup-typedoc.js` script will setup a `typedoc.json` configuration with the entry-points generated from the OpenAPI tags.

## GitHub Action

A GitHub action is provided that can be triggered with a `repository_dispatch`. This will fetch the OpenAPI file from GitLab then:

1. Generate a client
2. Build the client
3. Publish the client to NPM and crate a GitHub release
4. Generate docs from the generated client
5. Publish these docs to a branch called `gh-pages` for deployment on GitHub Pages

## Current Clients

- [Data Manager Client](https://github.com/InformaticsMatters/data-manager-npm-client)
- [Account Server Client](https://github.com/InformaticsMatters/account-server-js-client)

