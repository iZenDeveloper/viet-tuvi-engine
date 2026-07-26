# Public Calculator Comparison Oracles

Public calculators are used only as comparison oracles. They do not establish
authoritative Trung Châu conformance.

## Tử Vi Bắc Phái

- URL: <https://tuvibacphai.com/tuvi/>
- Public title: `An sao Trung Châu Lý Số`
- First capture: 2026-07-26
- Fixture: `fixtures/oracle/public-tuvibacphai-1990-05-17.json`

The page exposes separate options for two Tứ Hóa tables and for TCP versus
VDTTL Hỏa/Linh placement. The captured case used the default Khâm Thiên Môn
Tứ Hóa option, TCP thuận Hỏa/Linh, and the default chart mode.

The public page had a runtime error in its Tứ Trụ renderer
(`inrabinhchu`/`hanhchidahoa` was undefined). The Tử Vi canvas is rendered
before that call. The capture therefore isolated the public Tử Vi renderer and
recorded its canvas text and coordinates without modifying its calculation
rules.

For the initial case and all five expanded cases, `viet-tuvi-engine`
matches the public calculator on:

- Mệnh and Thân palace branches;
- Ngũ Hành Cục;
- all fourteen major-star palace positions.

An additional ten-case comparison set is stored in
`fixtures/oracle/public-tuvibacphai-cases-10.json`. It varies birth year,
gender, and hour:

- all ten cases match Mệnh, Thân, Cục, and all fourteen major-star positions.

Each case stores `expectedEngineMatch` and ordered `expectedDiffPaths` so CI
detects accidental regressions.

The expanded fixtures exposed a Five Tiger Escape implementation bug in the
engine for Mệnh at Tý or Sửu. The branch offset from Dần must wrap through all
twelve branches before reducing the stem index modulo ten. After that fix,
all sixteen public comparison cases match.

A further twenty-case boundary-focused set is stored in
`fixtures/oracle/public-tuvibacphai-cases-20.json`. It covers:

- years from 1960 through 2001;
- mixed male and female inputs;
- all five Cục values;
- fifteen Mệnh-at-Sửu cases and four Mệnh-at-Tý cases;
- a 23:00 birth-hour boundary.

All twenty cases match the corrected engine. Across the three captured sets,
the project now has 36 matching public-calculator comparison cases.

This evidence is classified as `comparison-oracle`, not
`expert-approved-oracle`.
