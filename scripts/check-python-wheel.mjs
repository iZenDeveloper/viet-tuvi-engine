import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = process.env.PYTHON ?? 'python3';
const temporaryRoot = mkdtempSync(join(tmpdir(), 'viet-tuvi-python-wheel-'));

try {
  const source = join(temporaryRoot, 'source');
  const wheels = join(temporaryRoot, 'wheels');
  const sitePackages = join(temporaryRoot, 'site-packages');
  mkdirSync(wheels);
  mkdirSync(sitePackages);
  cpSync(join(root, 'bindings', 'python'), source, {
    recursive: true,
    filter: path => ![
      '__pycache__',
      'build',
      'viet_tuvi_engine.egg-info'
    ].includes(basename(path))
  });

  execFileSync(python, [
    '-m',
    'pip',
    'wheel',
    source,
    '--no-deps',
    '--disable-pip-version-check',
    '--wheel-dir',
    wheels
  ], { stdio: 'pipe' });
  const wheelFiles = readdirSync(wheels).filter(file => file.endsWith('.whl'));
  if (wheelFiles.length !== 1) {
    throw new Error(`Expected one Python wheel, found ${wheelFiles.length}`);
  }
  const wheel = join(wheels, wheelFiles[0]);
  execFileSync(python, [
    '-m',
    'pip',
    'install',
    '--no-deps',
    '--disable-pip-version-check',
    '--target',
    sitePackages,
    wheel
  ], { stdio: 'pipe' });

  const smokeProgram = `
import json
import os
from pathlib import Path
import viet_tuvi_engine
from viet_tuvi_engine import (
    calculate,
    capabilities,
    compare_fixture,
    grounded_prompt,
    mcp_request,
    render_svg,
    timeline,
    validate,
)

site = Path(os.environ["VIET_TUVI_WHEEL_SITE"]).resolve()
module = Path(viet_tuvi_engine.__file__).resolve()
assert module.is_relative_to(site), (module, site)
input_data = {
    "localDateTime": "1990-05-17T14:30:00",
    "timezoneOffsetMinutes": 420,
    "gender": "female",
    "asOfYear": 2026,
}
chart = calculate(input_data)
assert len(chart["palaces"]) == 12
assert capabilities()["engine"] == "viet-tuvi-engine"
assert validate(input_data)["valid"] is True
assert len(timeline(input_data)["timeline"]["daiHan"]) == 12
assert grounded_prompt(chart)["evidence"]["engine"] == "viet-tuvi-engine"
assert "<svg" in render_svg(chart)
assert compare_fixture(input_data, {"cuc": {"code": chart["cuc"]["code"]}})["match"] is True
initialize = mcp_request({"jsonrpc": "2.0", "id": 1, "method": "initialize"})
assert initialize["result"]["serverInfo"]["version"] == chart["metadata"]["version"]
manifest = json.loads((module.parent / "_js" / "manifest.json").read_text())
assert len(manifest["sha256"]) >= 26
`;
  execFileSync(python, ['-c', smokeProgram], {
    env: {
      ...process.env,
      PYTHONPATH: sitePackages,
      VIET_TUVI_WHEEL_SITE: sitePackages
    },
    stdio: 'pipe'
  });
  if (!existsSync(join(sitePackages, 'viet_tuvi_engine', '_js', 'mcp', 'handler.js'))) {
    throw new Error('Installed wheel is missing nested MCP snapshot module');
  }

  console.log(JSON.stringify({
    wheel: wheelFiles[0],
    python,
    installedSnapshotModules: readdirSync(join(sitePackages, 'viet_tuvi_engine', '_js')).length,
    status: 'python-wheel-ready'
  }));
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
