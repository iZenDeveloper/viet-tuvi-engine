# Oracle Fixtures

Use `fixtures/oracle-fixture.example.json` as the shape for a comparison
fixture. `expected` is intentionally partial: include only fields copied from
an external calculator that are stable and unambiguous.

The fixture and bundle contract is defined by
`schemas/oracle-fixture.schema.json` and exported as
`viet-tuvi-engine/schema/oracle-fixture`. Official oracle fixtures require an
evidence classification, source URL, retrieval date, observation method, and
exact calculator options.

```sh
npm run compare:fixture -- fixtures/my-trung-chau-case.json
```

The command accepts a single fixture or bundle and validates it before
calculation. Exit code `0` means every recorded expectation is preserved;
`1` means calculated matches or diff paths changed; `2` means usage, JSON, or
schema validation failed. Its JSON report includes every case, stable diff
paths, and a summary suitable for CI.

This workflow does not copy external source code or copyrighted prose; it
stores only the minimum structured values needed for conformance.
