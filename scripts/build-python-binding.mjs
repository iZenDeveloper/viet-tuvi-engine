import {createHash} from 'node:crypto';
import {cpSync,mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';

const output=new URL('../bindings/python/viet_tuvi_engine/_js/',import.meta.url);
const sourceRoot=new URL('../dist/',import.meta.url);
mkdirSync(output,{recursive:true});

function collectJavaScriptFiles(directory,prefix=''){
  return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    const relative=prefix?`${prefix}/${entry.name}`:entry.name;
    if(entry.isDirectory())return collectJavaScriptFiles(new URL(`${entry.name}/`,directory),relative);
    return entry.isFile()&&entry.name.endsWith('.js')?[relative]:[];
  });
}

const files=collectJavaScriptFiles(sourceRoot).sort();
const hashes={};
for(const file of files){
  const source=new URL(file,sourceRoot),target=new URL(file,output);
  mkdirSync(new URL('.',target),{recursive:true});
  cpSync(source,target);
  hashes[file]=createHash('sha256').update(readFileSync(source)).digest('hex');
}
writeFileSync(new URL('manifest.json',output),`${JSON.stringify({engineVersion:'0.1.0',sha256:hashes},null,2)}\n`);
