# Architecture

The TypeScript core is a modular monolith. `src/calculate.ts` owns calculation
orchestration, while `src/index.ts` is the stable public facade. `src/types.ts`,
`src/locations.ts`, `src/calendar.ts`, and `src/stars/major.ts` own focused
domain contracts and rule data. `src/rules/cuc.ts` owns the Five Tiger Escape,
60 Jiazi Na Yin, and Five Element Bureau calculation. Auxiliary-star and
transformation tables live under `src/stars`, while short-term limit rules
live under `src/timeline`. Grounded prompts and SVG rendering live under
`src/prompts` and `src/svg` as adapters over `TuViChart`. Calculation
methodology/capabilities and palace relations have dedicated pure modules.
Shared domain constants and local-time normalization are isolated from the
calculator. Functions are pure with respect to their input; no network,
filesystem, locale, or system clock is consulted.

Fixture comparison, validation, sensitivity, compatibility, and timeline
views are feature modules over the standalone calculator. They do not import
the public facade, keeping the dependency graph acyclic.

The MCP dispatcher lives in `src/mcp/handler.ts`; both the package subpath
`viet-tuvi-engine/mcp` and the stdio executable use it without importing the
public facade. Engine, schema, rule-set, and individual rule identifiers are
centralized in `src/version.ts`.

The stable boundary is `TuViChart`: palaces and stars use machine codes, while `metadata`, `audit`, and `capabilities` expose methodology and implementation status. SVG, MCP, prompt generation, and CLI are adapters over this same chart.

The current `0.1.0` rule set is a deterministic baseline. The Vietnamese astronomical lunar conversion and the Tử Vi/Thiên Phủ major-star groups are implemented; the Cục mapping remains explicitly versioned in `audit` and must receive broader school-level conformance fixtures. New rule tables should add fixtures before changing output.
