import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from 'node:fs';

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

const packOutput = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: new URL('.', root),
  encoding: 'utf8'
});
const pack = JSON.parse(packOutput)[0];
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
  status: 'release-ready'
}));
