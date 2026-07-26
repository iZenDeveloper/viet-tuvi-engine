import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {solarToVietnameseLunar} from '../dist/calendar.js';
import {loadWasmCalendar} from '../dist/wasm.js';

test('WASM calendar kernel matches TypeScript calendar fixtures',async()=>{
  const bytes=readFileSync(new URL('../bindings/wasm/viet-tuvi-calendar.wasm',import.meta.url));
  const wasm=await loadWasmCalendar(bytes);
  assert.equal(wasm.abiVersion,1);
  for(const [day,month,year] of [[22,1,2023],[22,3,2023],[10,2,2024],[29,1,2025],[17,2,2026]]){
    assert.deepEqual(wasm.solarToLunar(day,month,year,7),solarToVietnameseLunar(day,month,year,7));
  }
  assert.equal(wasm.julianDay(1,1,2000),2451545);
  assert.ok(Number.isFinite(wasm.equationOfTimeMinutes(180)));
});
