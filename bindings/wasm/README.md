# WASM calendar kernel

The current engine keeps calendar and astrology orchestration in TypeScript so
the Node, browser, MCP, CLI, and Python surfaces remain identical. A future WASM
package should expose only pure calendar kernels (Julian day, solar longitude,
new moon, and sexagenary primitives), then let TypeScript orchestrate the rule
tables.

Implemented ABI version 1:

- `solarToLunarPacked(day, month, year, timezone_hours) -> i64`
- `equation_of_time_minutes(day_of_year) -> f64`
- `julianDay(day, month, year) -> i32`
- `abiVersion() -> i32`

`bindings/wasm/viet-tuvi-calendar.wasm` is built from
`assembly/calendar.ts`. The public `viet-tuvi-engine/wasm` loader decodes the
packed lunar date into `{day, month, year, leap}`. Parity tests compare it with
the TypeScript calendar across new-year and leap-month fixtures.

`manifest.json` records the ABI and SHA-256 integrity hash for the binary.
