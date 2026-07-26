# viet-tuvi-engine

[![CI](https://github.com/iZenDeveloper/viet-tuvi-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/iZenDeveloper/viet-tuvi-engine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Deterministic, offline-first Vietnamese Tử Vi Đẩu Số engine. TypeScript is the source of truth; the CLI, MCP server, demo, and Python binding all call the same calculation core.

## Quick start

```sh
npm install
npm test
```

```ts
import { calculateTuVi } from 'viet-tuvi-engine';

const chart = calculateTuVi({
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  gender: 'female',
  trueSolarTime: true,
  location: { city: 'vn-hanoi' },
  tradition: 'vietnamese',
  asOfYear: 2026,
  include: { daiHan: true, luuNien: true }
});
```

The result contains 12 palaces, 14 major stars, auxiliary star cycles, Tứ Hóa, Cục, Đại Hạn/Lưu Niên, relations, localized facts, warnings, and a versioned audit trail.

## Public API

- `calculateTuVi(input)` calculates a structured chart.
- `validateInput(input)` validates without throwing.
- `sensitivity(input)` scans adjacent hours and all 12 birth-hour branches.
- `compatibility(a, b)` returns evidence-backed structural aspects.
- `renderSvg(chart)` renders an accessible 4x4 chart.
- `createGroundedPrompt(chart, locale)` creates a cited evidence bundle.
- `listVietnamCities()` returns the offline city catalog.
- `getEngineCapabilities()` and `getMethodologyManifest()` expose versions and support.
- `compareChartFixture(input, expected)` compares stable fields against an oracle fixture.
- `handleMcpMessage(message)` handles MCP/JSON-RPC messages in-process.

JSON Schemas use Draft 2020-12. Calculation, chart, oracle-fixture, and
research contracts are exported from the corresponding
`viet-tuvi-engine/schema/*` package subpaths.

## Research evidence

NotebookLM research is kept separate from executable rule tables:

- `docs/research/imported/source-manifest.json` records the source catalogue.
- `docs/research/imported/profile-matrix.json` records profile evidence and default policy.
- `docs/research/imported/unresolved-rules.json` records conflicts and missing algorithms.
- `fixtures/research/research-fixtures.json` contains 25 schema-validated observations.

Research fixtures are not oracle conformance fixtures. Secondary-source conflicts,
including alternative Tử Vi placement formulas, remain isolated until an
authoritative edition and expert-approved expected values are supplied.

## CLI and MCP

```sh
npm run build
node dist/cli.js '{"localDateTime":"1990-05-17T14:30:00","timezoneOffsetMinutes":420,"gender":"female"}'
node dist/mcp-server.js
# or: npm run mcp:stdio
```

The stdio server implements MCP `2025-06-18`. Tools include validation, calculation, timeline, fixture comparison, sensitivity, compatibility, grounded prompts, SVG, methodology, capabilities, major-star metadata, and Vietnamese cities.

## Demo and Python

Serve the repository after building and open `/demo/`:

```sh
python3 -m http.server 4173
```

The Python binding is in `bindings/python` and delegates to the built JavaScript core, preserving calculation parity.

The WASM calendar kernel is in `bindings/wasm`. Import
`loadWasmCalendar` from `viet-tuvi-engine/wasm` and load the shipped
`viet-tuvi-calendar.wasm` bytes or a `Response`.

## Methodology status

Implemented: Vietnamese astronomical lunar conversion, true-solar-time longitude/EoT correction, Mệnh/Thân, Cục via 60 Jiazi Na Yin, Tử Vi/Thiên Phủ major-star groups, common auxiliary stars, Tứ Hóa, palace-stem Phi Hóa, Tràng Sinh, Thái Tuế, Bác Sĩ, Đại Hạn, Tiểu Hạn, Lưu Niên, Lưu Nguyệt, and Lưu Nhật baseline rules.

The `vietnamese` profile is the current rule set. `trung-chau`, `custom`, and broad school-level fixture validation are not yet complete. Phi Hóa and short-term timelines are baseline implementations whose conventions may vary by school; structured warnings expose these limits. The engine produces structured traditional-astrology data, not medical, legal, financial, or deterministic life advice.

## Contributing Evidence

See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting rules or fixtures.
Expert and calculator evidence must include its profile, exact settings,
provenance, scope, and permission to redistribute the minimal structured
values. AI-generated claims remain research material until independently
verified.
