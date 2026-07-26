import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToVietnameseLunar } from '../dist/calendar.js';
import { calculateTuVi, compareChartFixture, getMethodologyManifest } from '../dist/index.js';

test('lunar new year fixtures and version manifest',()=>{
  const fixtures=JSON.parse(readFileSync(new URL('../fixtures/lunar-new-year.json',import.meta.url)));
  for(const fixture of fixtures) assert.deepEqual(solarToVietnameseLunar(...fixture.solar,7),fixture.lunar);
  const manifest=getMethodologyManifest();
  assert.equal(manifest.ruleSetVersion,'vn-popular-0.2');
  assert.ok(manifest.rules.majorStars);
});

test('calendar boundary fixtures include month rollover and leap month',()=>{
  const fixtures=JSON.parse(readFileSync(new URL('../fixtures/calendar-boundaries.json',import.meta.url)));
  for(const fixture of fixtures) assert.deepEqual(solarToVietnameseLunar(...fixture.solar,7),fixture.lunar);
});

test('oracle fixture comparison supports genuinely partial expected fields',()=>{
  const input={
    localDateTime:'1990-05-17T14:30:00',
    timezoneOffsetMinutes:420,
    gender:'female',
    tradition:'vietnamese'
  };
  const chart=calculateTuVi(input);
  const partial={
    palaces:[{index:0,branch:chart.palaces[0].branch}],
    stars:[{code:'tu-vi',palaceIndex:chart.stars.find(star=>star.code==='tu-vi').palaceIndex}]
  };
  assert.equal(compareChartFixture(input,partial).match,true);
  assert.equal(compareChartFixture(input,{palaces:[{index:0,branch:'invalid'}]}).match,false);
});

test('public calculator comparison oracle matches stable chart fields',()=>{
  const fixture=JSON.parse(readFileSync(new URL('../fixtures/oracle/public-tuvibacphai-1990-05-17.json',import.meta.url)));
  assert.equal(fixture.classification,'comparison-oracle');
  const report=compareChartFixture(fixture.input,fixture.expected);
  assert.equal(report.match,true,JSON.stringify(report.diffs));
});

test('public calculator comparison set matches stable chart fields',()=>{
  const bundle=JSON.parse(readFileSync(new URL('../fixtures/oracle/public-tuvibacphai-cases.json',import.meta.url)));
  assert.equal(bundle.classification,'comparison-oracle');
  const reports=bundle.cases.map(fixture=>({
    id:fixture.id,
    expectedEngineMatch:fixture.expectedEngineMatch??true,
    report:compareChartFixture(fixture.input,fixture.expected)
  }));
  for(const item of reports) assert.equal(item.report.match,item.expectedEngineMatch,item.id);
  assert.ok(reports.every(item=>item.report.match));
});

test('ten additional public calculator cases preserve their comparison reports',()=>{
  const bundle=JSON.parse(readFileSync(new URL('../fixtures/oracle/public-tuvibacphai-cases-10.json',import.meta.url)));
  assert.equal(bundle.classification,'comparison-oracle');
  assert.equal(bundle.cases.length,10);
  const reports=bundle.cases.map(fixture=>({
    fixture,
    report:compareChartFixture(fixture.input,fixture.expected)
  }));
  for(const {fixture,report} of reports){
    assert.equal(report.match,fixture.expectedEngineMatch,fixture.id);
    assert.deepEqual(report.diffs.map(diff=>diff.path),fixture.expectedDiffPaths,fixture.id);
  }
  assert.equal(reports.filter(({report})=>report.match).length,10);
  assert.equal(reports.filter(({report})=>!report.match).length,0);
});

test('twenty boundary-focused public calculator cases match the engine',()=>{
  const bundle=JSON.parse(readFileSync(new URL('../fixtures/oracle/public-tuvibacphai-cases-20.json',import.meta.url)));
  assert.equal(bundle.classification,'comparison-oracle');
  assert.equal(bundle.cases.length,20);
  assert.ok(bundle.coverage.focus.includes('menh-ty'));
  assert.ok(bundle.coverage.focus.includes('menh-suu'));
  for(const fixture of bundle.cases){
    const report=compareChartFixture(fixture.input,fixture.expected);
    assert.equal(report.match,true,`${fixture.id}: ${JSON.stringify(report.diffs)}`);
    assert.deepEqual(report.diffs.map(diff=>diff.path),fixture.expectedDiffPaths,fixture.id);
  }
});

test('1976 public case uses wrapped Five Tiger Escape stem at Tý',()=>{
  const fixture=JSON.parse(readFileSync(new URL('../fixtures/oracle/public-tuvibacphai-cases.json',import.meta.url)))
    .cases.find(item=>item.id==='public-tuvibacphai-1976-11-03-female');
  const report=compareChartFixture(fixture.input,fixture.expected);
  assert.equal(report.match,true,JSON.stringify(report.diffs));
  const chart=report.actual;
  assert.equal(chart.palaces[0].branch,'Tý');
  assert.equal(chart.audit.find(entry=>entry.rule==='menh-stem-branch')?.value,'Canh Tý');
  assert.equal(chart.cuc.code,'tho-ngu-cuc');
});
