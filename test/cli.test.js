import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

test('CLI exposes version, capabilities, and chart calculation',()=>{
  assert.match(execFileSync('node',['dist/cli.js','--version'],{encoding:'utf8'}).trim(),/^0\.1\.0$/);
  const caps=JSON.parse(execFileSync('node',['dist/cli.js','--capabilities'],{encoding:'utf8'}));
  assert.equal(caps.engine,'viet-tuvi-engine');
  const chart=JSON.parse(execFileSync('node',['dist/cli.js',JSON.stringify({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,gender:'female'})],{encoding:'utf8'}));
  assert.equal(chart.palaces.length,12);
});
