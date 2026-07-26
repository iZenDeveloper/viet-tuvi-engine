# Architecture

The TypeScript core is a modular monolith. `src/index.ts` owns calculation
orchestration and the stable public API, while `src/types.ts`,
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

The stable boundary is `TuViChart`: palaces and stars use machine codes, while `metadata`, `audit`, and `capabilities` expose methodology and implementation status. SVG, MCP, prompt generation, and CLI are adapters over this same chart.

The current `0.1.0` rule set is a deterministic baseline. The Vietnamese astronomical lunar conversion and the Tử Vi/Thiên Phủ major-star groups are implemented; the Cục mapping remains explicitly versioned in `audit` and must receive broader school-level conformance fixtures. New rule tables should add fixtures before changing output.
