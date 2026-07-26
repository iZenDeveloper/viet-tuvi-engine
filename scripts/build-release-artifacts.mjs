import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const packageMetadata = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const python = process.env.PYTHON ?? 'python3';
const configuredOutput = process.env.VIET_TUVI_ARTIFACT_DIR;
const output = configuredOutput
  ? (isAbsolute(configuredOutput) ? configuredOutput : resolve(root, configuredOutput))
  : join(root, 'release-artifacts', `v${packageMetadata.version}`);
const temporaryRoot = mkdtempSync(join(tmpdir(), 'viet-tuvi-artifacts-'));

if (existsSync(output) && readdirSync(output).length > 0) {
  rmSync(temporaryRoot, { recursive: true, force: true });
  throw new Error(`Artifact output is not empty: ${output}`);
}

const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');

try {
  const staging = join(temporaryRoot, 'staging');
  const pythonSource = join(temporaryRoot, 'python-source');
  mkdirSync(staging);
  cpSync(join(root, 'bindings', 'python'), pythonSource, {
    recursive: true,
    filter: path => ![
      '__pycache__',
      'build',
      'viet_tuvi_engine.egg-info'
    ].includes(basename(path))
  });

  const npmPack = JSON.parse(execFileSync('npm', [
    'pack',
    '--json',
    '--pack-destination',
    staging
  ], {
    cwd: root,
    encoding: 'utf8'
  }))[0];
  execFileSync(python, [
    '-m',
    'pip',
    'wheel',
    pythonSource,
    '--no-deps',
    '--disable-pip-version-check',
    '--wheel-dir',
    staging
  ], { stdio: 'pipe' });

  const artifactNames = readdirSync(staging)
    .filter(file => file.endsWith('.tgz') || file.endsWith('.whl'))
    .sort();
  if (artifactNames.length !== 2) {
    throw new Error(`Expected npm and Python artifacts, found ${artifactNames.length}`);
  }
  if (!artifactNames.includes(npmPack.filename)) {
    throw new Error(`npm artifact is missing: ${npmPack.filename}`);
  }

  const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8'
  }).trim();
  const artifacts = artifactNames.map(file => {
    const path = join(staging, file);
    return {
      file,
      bytes: readFileSync(path).length,
      sha256: sha256(path)
    };
  });
  const manifest = {
    package: packageMetadata.name,
    version: packageMetadata.version,
    commit,
    artifacts
  };

  mkdirSync(output, { recursive: true });
  for (const artifact of artifacts) {
    cpSync(join(staging, artifact.file), join(output, artifact.file));
  }
  writeFileSync(
    join(output, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  writeFileSync(
    join(output, 'SHA256SUMS'),
    `${artifacts.map(artifact => `${artifact.sha256}  ${artifact.file}`).join('\n')}\n`
  );
  console.log(JSON.stringify({
    output,
    version: packageMetadata.version,
    commit,
    artifacts,
    status: 'release-artifacts-ready'
  }));
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
