# Oracle Fixtures

Use `fixtures/oracle-fixture.example.json` as the shape for a comparison
fixture. `expected` is intentionally partial: include only fields copied from
an external calculator that are stable and unambiguous.

```sh
npm run compare:fixture -- fixtures/my-trung-chau-case.json
```

Exit code `0` means all supplied fields match. Exit code `1` prints a JSON
diff. This workflow does not copy external source code or copyrighted prose;
it stores only the minimum structured values needed for conformance.
