import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {calculateTuVi} from '../dist/index.js';

const load=name=>JSON.parse(readFileSync(new URL(`../schemas/${name}`,import.meta.url)));

test('calculation input and chart output conform to Draft 2020-12 schemas',()=>{
  const ajv=new Ajv2020({allErrors:true,strict:true});
  addFormats(ajv);
  const validateInput=ajv.compile(load('calculate-input.schema.json'));
  const validateChart=ajv.compile(load('chart.schema.json'));
  const input={
    localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,gender:'female',
    trueSolarTime:true,location:{city:'vn-hanoi'},tradition:'vietnamese',
    asOfYear:2026,asOfDate:'2026-07-26',
    include:{daiHan:true,tieuHan:true,luuNien:true,luuNguyet:true,luuNhat:true,phiHoa:false}
  };
  assert.equal(validateInput(input),true,JSON.stringify(validateInput.errors));
  assert.equal(validateChart(calculateTuVi(input)),true,JSON.stringify(validateChart.errors));
  assert.equal(validateChart(calculateTuVi({...input,include:{...input.include,phiHoa:true}})),true,JSON.stringify(validateChart.errors));
});

test('oracle fixtures conform to the provenance-aware Draft 2020-12 schema',()=>{
  const ajv=new Ajv2020({allErrors:true,strict:true});
  addFormats(ajv);
  ajv.addSchema(load('calculate-input.schema.json'));
  const validateOracle=ajv.compile(load('oracle-fixture.schema.json'));
  const fixtures=[
    '../fixtures/oracle-fixture.example.json',
    '../fixtures/oracle/public-tuvibacphai-1990-05-17.json',
    '../fixtures/oracle/public-tuvibacphai-cases.json',
    '../fixtures/oracle/public-tuvibacphai-cases-10.json',
    '../fixtures/oracle/public-tuvibacphai-cases-20.json'
  ];
  for(const path of fixtures){
    const fixture=JSON.parse(readFileSync(new URL(path,import.meta.url)));
    assert.equal(validateOracle(fixture),true,`${path}: ${JSON.stringify(validateOracle.errors)}`);
  }
});
