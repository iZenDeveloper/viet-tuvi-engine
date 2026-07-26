import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));

test('imported NotebookLM research fixtures are schema-valid and isolated', () => {
  const schema = readJson('../schemas/research-fixture.schema.json');
  const fixtures = readJson('../fixtures/research/research-fixtures.json');
  const manifest = readJson('../docs/research/imported/source-manifest.json');
  const profiles = readJson('../docs/research/imported/profile-matrix.json');
  const unresolved = readJson('../docs/research/imported/unresolved-rules.json');
  const deepseek = readJson('../docs/research/imported/deepseek-wu-xing-ju-review.json');
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  assert.equal(validate(fixtures), true, JSON.stringify(validate.errors));
  assert.equal(fixtures.length, 25);
  const sourceIds = new Set(manifest.sources.map(source => source.id));
  for (const fixture of fixtures) {
    assert.notEqual(fixture.profile, 'vietnamese');
    for (const observation of Object.values(fixture.observations)) {
      for (const sourceRef of observation.sourceRefs ?? []) assert.equal(sourceIds.has(sourceRef), true);
      if (observation.status === 'unresolved_due_to_missing_source_data') assert.equal(observation.value, null);
    }
  }
  assert.ok(unresolved.unresolvedRules.length > 0);
  assert.equal(deepseek.analysis_title.includes('Wu Xing Ju'), true);
  assert.equal(deepseek.candidate_rules.length, 3);
  const baseline = profiles.profiles.find(profile => profile.profileId === 'vn-popular-0.1');
  assert.equal(baseline?.doNotUseAsDefault, false);
  assert.ok(profiles.profiles
    .filter(profile => profile.profileId !== 'vn-popular-0.1')
    .every(profile => profile.doNotUseAsDefault === true));

  for (const [file, value] of [
    ['../schemas/source-manifest.schema.json', manifest],
    ['../schemas/profile-matrix.schema.json', profiles],
    ['../schemas/unresolved-rules.schema.json', unresolved]
  ]) {
    const manifestSchema = readJson(file);
    const valid = ajv.compile(manifestSchema)(value);
    assert.equal(valid, true, `${file}: ${JSON.stringify(ajv.errors)}`);
  }
});
