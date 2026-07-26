import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTuVi,serializeChart} from '../dist/index.js';

test('chart invariants hold across years, genders, and hour branches',()=>{
  for(const year of [1984,1990,2000,2012,2024,2036]){
    for(const gender of ['male','female']){
      for(const hour of [0,6,12,18,23]){
        const input={localDateTime:`${year}-05-17T${String(hour).padStart(2,'0')}:30:00`,timezoneOffsetMinutes:420,gender,asOfYear:2026,include:{daiHan:true,luuNien:true}};
        const chart=calculateTuVi(input);
        assert.equal(chart.palaces.length,12);
        assert.equal(chart.palaces.filter(p=>p.isMenh).length,1);
        assert.equal(chart.palaces.filter(p=>p.isThan).length,1);
        assert.equal(new Set(chart.palaces.map(p=>p.code)).size,12);
        assert.equal(chart.stars.filter(s=>s.kind==='major').length,14);
        assert.equal(chart.stars.filter(s=>s.kind==='transformation').length,4);
        assert.ok(chart.stars.every(s=>Number.isInteger(s.palaceIndex)&&s.palaceIndex>=0&&s.palaceIndex<12));
        assert.equal(new Set(chart.timeline.daiHan.map(x=>x.palaceIndex)).size,12);
        assert.equal(serializeChart(chart),serializeChart(calculateTuVi(input)));
      }
    }
  }
});
