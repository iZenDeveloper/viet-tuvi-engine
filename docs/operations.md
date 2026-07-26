# Operations

## TypeScript package

```sh
npm ci
npm test
npm run build
npm pack --dry-run
```

The package is offline-only and does not require environment variables, network access, a database, or a system timezone setting.

## MCP stdio

Start `node dist/mcp-server.js` and send one JSON-RPC object per line. The server emits one response per request. Notifications such as `notifications/initialized` intentionally produce no output.

`docs/mcp-client-config.json` contains a host configuration template. Replace
the placeholder with the absolute path to this repository's built server.

The recommended handshake is:

1. `initialize`
2. `notifications/initialized`
3. `tools/list`
4. `tools/call`

The server also exposes `resources/list` and `resources/read` for:

- `tuvi://methodology`
- `tuvi://sources/trung-chau`

## Python binding

The Python package delegates to `dist/cli.js` and `dist/mcp-server.js`; it does not duplicate rules. Build the TypeScript core first and set `PYTHONPATH=bindings/python`.

`npm run build:python` creates a bundled JavaScript snapshot under
`bindings/python/viet_tuvi_engine/_js`, so a built Python wheel does not depend
on the repository layout.

## Determinism

Calculation output depends only on input and versioned rule tables. `metadata.calculatedAt` is derived from the input instant, not the system clock. Any rule change must add or update a fixture and the methodology manifest.

## Release verification

Run the same release gate used by CI:

```sh
npm run check:release
```

It verifies npm, runtime, MCP, and Python version parity; package entrypoints;
the Python JavaScript snapshot; the WASM integrity manifest; MIT licensing;
and the npm tarball contents. It also installs the tarball in an isolated
temporary consumer project and runs the public imports and binaries. It does
not create a tag or publish a package.
