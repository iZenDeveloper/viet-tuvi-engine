import {createHash} from 'node:crypto';
import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';

const output=new URL('../bindings/python/viet_tuvi_engine/_js/',import.meta.url);
mkdirSync(output,{recursive:true});
const files=[
  'calendar.js',
  'index.js',
  'locations.js',
  'stars/major.js',
  'types.js',
  'cli.js',
  'mcp-server.js'
];
const hashes={};
for(const file of files){
  const source=new URL(`../dist/${file}`,import.meta.url),target=new URL(file,output);
  mkdirSync(new URL('.',target),{recursive:true});
  cpSync(source,target);
  hashes[file]=createHash('sha256').update(readFileSync(source)).digest('hex');
}
writeFileSync(new URL('manifest.json',output),`${JSON.stringify({engineVersion:'0.1.0',sha256:hashes},null,2)}\n`);
