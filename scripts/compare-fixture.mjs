#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {compareChartFixture} from '../dist/index.js';

const file=process.argv[2];
if(!file){
  console.error('Usage: npm run compare:fixture -- path/to/fixture.json');
  process.exitCode=2;
}else{
  try{
    const fixture=JSON.parse(readFileSync(file,'utf8'));
    const report=compareChartFixture(fixture.input,fixture.expected);
    console.log(JSON.stringify({match:report.match,diffs:report.diffs},null,2));
    if(!report.match)process.exitCode=1;
  }catch(error){
    console.error(JSON.stringify({error:error instanceof Error?error.message:'Invalid fixture'}));
    process.exitCode=1;
  }
}
