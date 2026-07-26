#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { compareChartFixture } from '../dist/index.js';

const file = process.argv[2];

function write(value, stream = process.stdout) {
  stream.write(`${JSON.stringify(value, null, 2)}\n`);
}

function schemaValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(JSON.parse(readFileSync(new URL('../schemas/calculate-input.schema.json', import.meta.url))));
  return ajv.compile(JSON.parse(readFileSync(new URL('../schemas/oracle-fixture.schema.json', import.meta.url))));
}

if (!file) {
  write({
    error: 'fixture path is required',
    usage: 'npm run compare:fixture -- path/to/fixture.json'
  }, process.stderr);
  process.exitCode = 2;
} else {
  try {
    const fixture = JSON.parse(readFileSync(file, 'utf8'));
    const validate = schemaValidator();
    if (!validate(fixture)) {
      write({
        file,
        schemaValid: false,
        errors: validate.errors?.map(error => ({
          instancePath: error.instancePath,
          schemaPath: error.schemaPath,
          keyword: error.keyword,
          message: error.message
        })) ?? []
      }, process.stderr);
      process.exitCode = 2;
    } else {
      const cases = 'cases' in fixture ? fixture.cases : [fixture];
      const reports = cases.map(item => {
        const comparison = compareChartFixture(item.input, item.expected);
        const expectedEngineMatch = item.expectedEngineMatch ?? true;
        const actualDiffPaths = comparison.diffs.map(diff => diff.path);
        const pathsMatch = item.expectedDiffPaths === undefined
          || JSON.stringify(actualDiffPaths) === JSON.stringify(item.expectedDiffPaths);
        return {
          id: item.id,
          expectedEngineMatch,
          actualMatch: comparison.match,
          expectationMet: comparison.match === expectedEngineMatch && pathsMatch,
          diffs: comparison.diffs
        };
      });
      const expectationsMet = reports.filter(report => report.expectationMet).length;
      write({
        file,
        schemaValid: true,
        classification: fixture.classification,
        source: fixture.source,
        cases: reports,
        summary: {
          total: reports.length,
          matched: reports.filter(report => report.actualMatch).length,
          mismatched: reports.filter(report => !report.actualMatch).length,
          expectationsMet
        }
      });
      if (expectationsMet !== reports.length) process.exitCode = 1;
    }
  } catch (error) {
    write({
      file,
      error: error instanceof Error ? error.message : 'Invalid fixture'
    }, process.stderr);
    process.exitCode = 2;
  }
}
