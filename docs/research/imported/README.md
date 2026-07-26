# Imported Research Dataset

These files were supplied from the user's NotebookLM research session:

- `source-manifest.json`: source catalogue and coverage notes.
- `profile-matrix.json`: evidence status for VDC, NAV, TCP, VDTTL, and the current Vietnamese baseline.
- `unresolved-rules.json`: conflicts and missing algorithmic evidence.

They are provenance material, not executable rule tables. In particular,
secondary-source formulas for the position of Tử Vi remain
`conflict-unresolved` and must not replace the `vietnamese` baseline.

The 25 research cases are stored separately in
`fixtures/research/research-fixtures.json`. They are schema-checked
observations, not oracle conformance fixtures.

Model-generated investigations are preserved verbatim for audit:

- `deepseek-wu-xing-ju-review.json`
- `qwen-wu-xing-ju-review.txt`
- `glm-5.2-wu-xing-ju-review.txt`

Their evaluated conclusions live in adjacent assessment documents under
`docs/research/`. A model response is never promoted to an executable rule
without reproducible evidence.
