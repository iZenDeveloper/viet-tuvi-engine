# Python binding

Build the TypeScript core first:

```sh
npm run build
PYTHONPATH=bindings/python python -c "from viet_tuvi_engine import calculate; print(calculate({'localDateTime':'1990-05-17T14:30:00','timezoneOffsetMinutes':420,'gender':'female'})['cuc'])"
```

The binding intentionally delegates to a bundled JavaScript snapshot of the
engine when installed, and falls back to the repository `dist` during
development. It does not duplicate astrology rules.

Direct helpers are available for `calculate`, `timeline`, `sensitivity`,
`compatibility`, `grounded_prompt`, `render_svg`, `compare_fixture`, and
`capabilities`. Use `validate` to check an input without raising an engine
calculation error. `mcp_request` remains available for raw MCP access.
