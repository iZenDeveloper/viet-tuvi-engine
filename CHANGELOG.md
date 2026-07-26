# Changelog

## Unreleased

- Split public contracts, Vietnamese locations, Cục rules, star tables, and
  short-term limit rules into focused TypeScript modules while preserving the
  root API and Python parity.
- Moved grounded prompt generation and SVG rendering into chart-only adapter
  modules without changing their public exports.
- Isolated methodology/capability metadata and palace-relation construction
  while preserving chart ordering and provenance output.
- Isolated shared palace/branch constants and deterministic local-time helpers
  in preparation for a standalone calculation orchestrator.
- Moved `calculateTuVi` into a standalone orchestrator module and reduced
  `src/index.ts` to the stable public facade and higher-level APIs.
- Split fixture comparison, validation, sensitivity, compatibility, and
  timeline views into acyclic feature modules over the calculator.
- Moved MCP message dispatch into a dedicated package subpath and centralized
  runtime version and rule identifiers for release consistency.
- Added a release gate covering metadata parity, package entrypoints, Python
  snapshot hashes, WASM integrity, licensing, and npm tarball contents.
- Added contribution, security, pull-request, bug-report, and expert-fixture
  workflows with explicit evidence classification and privacy requirements.
- Added the missing Python `validate` helper over the existing MCP
  `validate-input` tool.
- Fixed Five Tiger Escape palace stems for Mệnh at Tý and Sửu by wrapping
  the twelve-branch offset before reducing modulo ten.
- Bumped the calculation rule set to `vn-popular-0.2` and the Cục audit rule
  to `jiazi-nayin-2`.
- Confirmed all thirty-six public-calculator comparison cases now match Mệnh,
  Thân, Cục, and all fourteen major-star positions, including twenty
  boundary-focused Mệnh-at-Tý/Sửu cases.

## 0.1.0

Initial deterministic baseline:

- Vietnamese astronomical lunar calendar and true solar time correction.
- Mệnh, Thân, Cục, 14 major stars, 49 auxiliary stars, and Tứ Hóa.
- Palace-stem Phi Hóa baseline.
- Đại Hạn, Tiểu Hạn, Lưu Niên, Lưu Nguyệt, and Lưu Nhật.
- Stable relations, facts, warnings, provenance, and versioned audit.
- Draft 2020-12 input/output schemas.
- Accessible SVG, web demo, CLI, MCP `2025-06-18`, and Python binding.
- AssemblyScript WASM calendar kernel with a public loader and parity tests.
- SHA-256 WASM manifest and bundled JavaScript snapshot for standalone Python wheels.
- Calendar/oracle fixtures, invariant tests, schema conformance, and CI.

Known limits:

- `trung-chau` and `custom` use the Vietnamese fallback with warnings.
- Broad expert-reviewed school fixtures are still required for a `1.0` claim.
