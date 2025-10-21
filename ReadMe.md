# NDLA api-documentation

![CI](https://github.com/NDLANO/api-documentation/workflows/CI/badge.svg)

## Requirements

- Node.js 22.17.1 (LTS)
- yarn 1.22
- Docker (optional)

## Getting started

What's in the box?

- Express
- TypeScript
- Jest (unit tests via ts-jest)

### Dependencies

All dependencies are defined in `package.json` and are managed with yarn. To
initially install all dependencies and when the list dependency has changed,
run `yarn`.

```
$ yarn
```

### Start development server

Start the server with hot reloading (ts-node + nodemon) listening on port 3001.

```
$ yarn dev
```

To use a different api set the `NDLA_API_URL` environment variable.

### Unit tests

Test framework: Jest (ts-jest). Snapshot/unit tests in TypeScript.

```
$ yarn test
```

Do you tdd?

```
$ yarn tdd
```

## Other scripts

```
# Run with NODE_ENV=production:
$ npm run start-prod
```

```
# Docker stuff
$ ./build.sh
```

## Build & Scripts

Development now uses TypeScript. Source lives in `src/` and is compiled to `dist/` for production.

Install:
```
yarn
```

Development (watch + ts-node):
```
yarn dev
```

Build (emit JS to dist):
```
yarn build
```

Production run (after build):
```
yarn start-prod
```

Run tests:
```
yarn test
```

Watch tests (TDD):
```
yarn tdd
```

Lint:
```
yarn lint
```

## Environment Variables

Key (default):
- `API_DOCUMENTATION_PORT` (3000) Port to listen on in production build.
- `NDLA_API_URL` (http://api-gateway.ndla-local:8001) Base URL for Kong gateway.
- `WHITELIST` (comma separated list) Override the default public API whitelist.
- `API_DOC_PATH_REGEX` (api-docs) Regex used to detect swagger/openapi doc routes.
- `AUTH0_PERSONAL_CLIENT_ID` (empty) Optional OAuth client id for Swagger UI auth.

## Minimal Dependency Notes

Core runtime deps:
- express, compression, cors, swagger-ui-dist, lodash

Dev/tooling:
- typescript, ts-node, ts-jest, @types/* packages, nodemon, eslint + config.

(Use `npm ls --depth 0` or `yarn list --depth=0` for a current authoritative list.)

## Docker

- Performs a TypeScript build in a build stage.
- Copies compiled `dist/` plus static assets into a slim runtime stage.
- Runs as non-root `node` user.
- Exposes port 3000 and defines a HEALTHCHECK on `/health`.

Build locally:
```
./build.sh
```

## Code Style (Updated)

ESLint (with TypeScript rules) enforces code style. Configuration lives in `.eslintrc.js`. Use `yarn lint` (and optionally `--fix`).
