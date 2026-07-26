import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const readText = path => readFileSync(new URL(path, root), 'utf8');
const readJson = path => JSON.parse(readText(path));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectJavaScriptFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      return collectJavaScriptFiles(new URL(`${entry.name}/`, directory), relative);
    }
    return entry.isFile() && entry.name.endsWith('.js') ? [relative] : [];
  });
}

function packageTargets(packageMetadata) {
  const targets = [
    packageMetadata.main,
    packageMetadata.types,
    ...Object.values(packageMetadata.bin ?? {})
  ];
  for (const definition of Object.values(packageMetadata.exports ?? {})) {
    if (typeof definition === 'string') targets.push(definition);
    else targets.push(...Object.values(definition));
  }
  return targets.filter(Boolean);
}

const packageMetadata = readJson('package.json');
const pythonMetadata = readText('bindings/python/pyproject.toml');
const pythonManifest = readJson('bindings/python/viet_tuvi_engine/_js/manifest.json');
const wasmManifest = readJson('bindings/wasm/manifest.json');
const license = readText('LICENSE');
for (const requiredFile of ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md']) {
  assert(existsSync(new URL(requiredFile, root)), `repository policy file is missing: ${requiredFile}`);
}

assert(existsSync(new URL('dist/index.js', root)), 'dist is missing; run npm run build:python');
const { calculateTuVi, getMethodologyManifest } = await import('../dist/index.js');
const { handleMcpMessage } = await import('../dist/mcp/handler.js');

const input = {
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  gender: 'female'
};
const runtimeVersions = [
  calculateTuVi(input).metadata.version,
  getMethodologyManifest().engineVersion,
  handleMcpMessage({ id: 1, method: 'initialize' }).result.serverInfo.version
];

assert(runtimeVersions.every(version => version === packageMetadata.version), 'runtime versions do not match package.json');
assert(new RegExp(`^version = "${packageMetadata.version.replaceAll('.', '\\.')}"$`, 'm').test(pythonMetadata), 'Python version does not match package.json');
assert(pythonManifest.engineVersion === packageMetadata.version, 'Python manifest version does not match package.json');
assert(packageMetadata.license === 'MIT' && /MIT License/.test(license), 'MIT license metadata or file is missing');

for (const target of packageTargets(packageMetadata)) {
  const normalized = target.replace(/^\.\//, '');
  assert(existsSync(new URL(normalized, root)), `package target is missing: ${target}`);
}

const distRoot = new URL('dist/', root);
const pythonRoot = new URL('bindings/python/viet_tuvi_engine/_js/', root);
const distFiles = collectJavaScriptFiles(distRoot).sort();
const manifestFiles = Object.keys(pythonManifest.sha256).sort();
assert(JSON.stringify(distFiles) === JSON.stringify(manifestFiles), 'Python snapshot module list differs from dist');
for (const file of manifestFiles) {
  const snapshot = readFileSync(new URL(file, pythonRoot));
  assert(sha256(snapshot) === pythonManifest.sha256[file], `Python snapshot hash mismatch: ${file}`);
}

const wasmPath = new URL(`bindings/wasm/${wasmManifest.file}`, root);
const wasmBytes = readFileSync(wasmPath);
assert(statSync(wasmPath).size === wasmManifest.bytes, 'WASM byte count does not match manifest');
assert(sha256(wasmBytes) === wasmManifest.sha256, 'WASM hash does not match manifest');

const releaseDirectory = mkdtempSync(join(tmpdir(), 'viet-tuvi-release-'));
let pack;
let consumerSmoke = false;
try {
  const packOutput = execFileSync('npm', ['pack', '--json', '--pack-destination', releaseDirectory], {
    cwd: new URL('.', root),
    encoding: 'utf8'
  });
  pack = JSON.parse(packOutput)[0];
  const tarball = join(releaseDirectory, pack.filename);
  const consumerDirectory = join(releaseDirectory, 'consumer');
  mkdirSync(consumerDirectory);
  writeFileSync(join(consumerDirectory, 'package.json'), '{"private":true,"type":"module"}\n');
  execFileSync('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--package-lock=false',
    tarball
  ], { cwd: consumerDirectory, stdio: 'pipe' });

  const smokeProgram = `
    import { readFileSync } from 'node:fs';
    import { createRequire } from 'node:module';
    import { calculateTuVi } from 'viet-tuvi-engine';
    import { solarToVietnameseLunar } from 'viet-tuvi-engine/calendar';
    import { handleMcpMessage } from 'viet-tuvi-engine/mcp';
    import { loadWasmCalendar } from 'viet-tuvi-engine/wasm';
    const chart=calculateTuVi({localDateTime:'1990-05-17T14:30:00',timezoneOffsetMinutes:420,gender:'female'});
    if(chart.palaces.length!==12)throw new Error('root export smoke failed');
    if(solarToVietnameseLunar(10,2,2024,7).day!==1)throw new Error('calendar export smoke failed');
    if(handleMcpMessage({id:1,method:'initialize'}).result.serverInfo.version!=='${packageMetadata.version}')throw new Error('MCP export smoke failed');
    const wasmBytes=readFileSync('node_modules/viet-tuvi-engine/bindings/wasm/viet-tuvi-calendar.wasm');
    const wasm=await loadWasmCalendar(wasmBytes);
    if(wasm.abiVersion!==1||wasm.solarToLunar(10,2,2024,7).day!==1)throw new Error('WASM export smoke failed');
    const require=createRequire(import.meta.url);
    const oracleSchema=require('viet-tuvi-engine/schema/oracle-fixture');
    if(!oracleSchema.$id?.includes('oracle-fixture'))throw new Error('schema export smoke failed');
  `;
  execFileSync('node', ['--input-type=module', '--eval', smokeProgram], {
    cwd: consumerDirectory,
    stdio: 'pipe'
  });
  const binDirectory = join(consumerDirectory, 'node_modules', '.bin');
  const cliVersion = execFileSync(join(binDirectory, 'viet-tuvi'), ['--version'], {
    encoding: 'utf8'
  }).trim();
  assert(cliVersion === packageMetadata.version, 'installed CLI version mismatch');
  const mcpOutput = execFileSync(join(binDirectory, 'viet-tuvi-mcp'), [], {
    input: '{"jsonrpc":"2.0","id":1,"method":"initialize"}\n',
    encoding: 'utf8'
  });
  assert(JSON.parse(mcpOutput).result.serverInfo.version === packageMetadata.version, 'installed MCP binary smoke failed');
  consumerSmoke = true;
} finally {
  rmSync(releaseDirectory, { recursive: true, force: true });
}

const packedPaths = pack.files.map(file => file.path);
assert(!packedPaths.some(path => path.includes('__pycache__') || /\.py[cod]$/.test(path)), 'npm package contains Python cache files');
assert(packedPaths.includes('LICENSE'), 'npm package does not contain LICENSE');
assert(packedPaths.includes('dist/index.js'), 'npm package does not contain the root runtime');
assert(packedPaths.includes('dist/mcp/handler.js'), 'npm package does not contain the MCP subpath');

console.log(JSON.stringify({
  package: `${packageMetadata.name}@${packageMetadata.version}`,
  runtimeVersions,
  javascriptModules: distFiles.length,
  wasmBytes: wasmBytes.length,
  packedFiles: pack.entryCount,
  consumerSmoke,
  status: 'release-ready'
}));
