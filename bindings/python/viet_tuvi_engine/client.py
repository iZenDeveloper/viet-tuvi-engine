import json
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
LOCAL_JS = Path(__file__).resolve().parent / "_js"
CLI = LOCAL_JS / "cli.js" if (LOCAL_JS / "cli.js").exists() else ROOT / "dist" / "cli.js"
MCP = LOCAL_JS / "mcp-server.js" if (LOCAL_JS / "mcp-server.js").exists() else ROOT / "dist" / "mcp-server.js"


class TuViEngineError(RuntimeError):
    pass


def _run(script: Path, args: list[str], stdin: str | None = None) -> str:
    if not script.exists():
        raise TuViEngineError("TypeScript core is not built; run `npm run build`")
    process = subprocess.run(
        ["node", str(script), *args],
        input=stdin,
        text=True,
        capture_output=True,
        check=False,
    )
    if process.returncode:
        raise TuViEngineError(process.stderr.strip() or "Engine process failed")
    return process.stdout.strip()


def calculate(input_data: dict[str, Any]) -> dict[str, Any]:
    return json.loads(_run(CLI, [json.dumps(input_data, ensure_ascii=False)]))


def mcp_request(message: dict[str, Any]) -> dict[str, Any]:
    output = _run(MCP, [], json.dumps(message, ensure_ascii=False) + "\n")
    return json.loads(output.splitlines()[0])


def _tool(name: str, arguments: dict[str, Any]) -> Any:
    response = mcp_request({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": arguments},
    })
    if "error" in response:
        raise TuViEngineError(response["error"].get("message", "MCP tool failed"))
    return response["result"]["structuredContent"]


def capabilities() -> dict[str, Any]:
    return _tool("capabilities", {})


def timeline(input_data: dict[str, Any]) -> dict[str, Any]:
    return _tool("timeline", input_data)


def sensitivity(input_data: dict[str, Any]) -> dict[str, Any]:
    return _tool("sensitivity", input_data)


def compatibility(left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any]:
    return _tool("compatibility", {"a": left, "b": right})


def grounded_prompt(chart: dict[str, Any], locale: str = "vi") -> dict[str, Any]:
    return _tool("grounded-prompt", {"chart": chart, "locale": locale})


def render_svg(chart: dict[str, Any]) -> str:
    return _tool("render-svg", {"chart": chart})["svg"]


def compare_fixture(input_data: dict[str, Any], expected: dict[str, Any]) -> dict[str, Any]:
    return _tool("compare-fixture", {"input": input_data, "expected": expected})
