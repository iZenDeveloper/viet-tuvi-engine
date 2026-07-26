# Contributing

Contributions are welcome when they preserve deterministic output, stable
machine codes, explicit methodology versions, and the separation between
research evidence and executable rules.

## Development

Use Node.js 20 or newer:

```sh
npm ci
npm test
npm run check:release
```

All calculation changes must include focused tests or fixtures. Do not update
an expected value only to make a failing test pass; document the rule,
provenance, and reason for the behavioral change.

## Evidence Classes

Evidence must be classified before it enters the repository:

- `research`: a claim or observation requiring verification.
- `comparison-oracle`: reproducible output from a named calculator with its
  exact settings and capture date.
- `expert-approved-oracle`: expected values reviewed by an identified domain
  expert, with the applicable tradition and scope stated.
- `primary-source`: a verifiable edition, page or scan, and exact quotation.

Model-generated text, search summaries, and unattributed formulas remain
research evidence. They must not become executable rules without reproducible
fixtures or a verifiable primary source.

## Fixture Requirements

A conformance fixture should include:

- Gregorian local date and time, timezone offset, gender, and location or
  longitude when relevant;
- lunar date as observed by the source;
- tradition/profile and every calculator option that affects placement;
- expected values limited to fields actually observed;
- source name, URL or bibliographic citation, capture date, and evidence class;
- a note describing consent to redistribute the submitted structured values.

Use synthetic, historical, already-public, or explicitly consented birth data.
Do not submit names, contact details, private interpretations, screenshots
containing personal data, or unrelated biographical information.

Public calculator fixtures belong under `fixtures/oracle/`. Unverified
research belongs under `fixtures/research/` or `docs/research/imported/` and
must remain isolated from runtime rule tables.

Oracle submissions must validate against
`schemas/oracle-fixture.schema.json`. Research datasets use
`schemas/research-fixture.schema.json`.

Run `npm run compare:fixture -- path/to/fixture.json` before submitting an
oracle fixture or bundle.

## Pull Requests

Keep changes narrowly scoped. A pull request changing calculation behavior
should state:

- the affected stable codes and profiles;
- the old and new results;
- the rule/version change;
- supporting evidence and confidence level;
- tests added and compatibility impact.

Run the complete test and release gates before requesting review.
