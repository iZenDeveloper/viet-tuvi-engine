import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const run = file => spawnSync('node', ['scripts/compare-fixture.mjs', file], {
  encoding: 'utf8'
});

test('fixture comparison CLI validates and compares single fixtures and bundles',()=>{
  const single=run('fixtures/oracle/public-tuvibacphai-1990-05-17.json');
  assert.equal(single.status,0,single.stderr);
  const singleReport=JSON.parse(single.stdout);
  assert.equal(singleReport.schemaValid,true);
  assert.deepEqual(singleReport.summary,{total:1,matched:1,mismatched:0,expectationsMet:1});

  const bundle=run('fixtures/oracle/public-tuvibacphai-cases-10.json');
  assert.equal(bundle.status,0,bundle.stderr);
  const bundleReport=JSON.parse(bundle.stdout);
  assert.equal(bundleReport.summary.total,10);
  assert.equal(bundleReport.summary.expectationsMet,10);

  const mismatch=run('fixtures/oracle-fixture.example.json');
  assert.equal(mismatch.status,1,mismatch.stderr);
  assert.equal(JSON.parse(mismatch.stdout).summary.expectationsMet,0);

  const invalid=run('fixtures/research/research-fixtures.json');
  assert.equal(invalid.status,2,invalid.stdout);
  assert.equal(JSON.parse(invalid.stderr).schemaValid,false);
});
