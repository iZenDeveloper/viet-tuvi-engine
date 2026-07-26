import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';

const file=new URL('../bindings/wasm/viet-tuvi-calendar.wasm',import.meta.url);
const bytes=readFileSync(file);
const manifest={abiVersion:1,file:'viet-tuvi-calendar.wasm',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
writeFileSync(new URL('../bindings/wasm/manifest.json',import.meta.url),`${JSON.stringify(manifest,null,2)}\n`);
