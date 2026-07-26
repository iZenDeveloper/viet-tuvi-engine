#!/usr/bin/env node
import { createInterface } from 'node:readline';
import { handleMcpMessage } from './mcp/handler.js';

const lines=createInterface({input:process.stdin,terminal:false});
lines.on('line',(line)=>{
  if(!line.trim()) return;
  try {
    const response=handleMcpMessage(JSON.parse(line));
    if(response!==null) process.stdout.write(`${JSON.stringify(response)}\n`);
  } catch(error) {
    process.stdout.write(`${JSON.stringify({jsonrpc:'2.0',id:null,error:{code:-32700,message:error instanceof Error?error.message:'Parse error'}})}\n`);
  }
});
