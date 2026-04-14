# OpenClaw Setup

Use this plugin when OpenClaw should turn a task request into a Linear issue that Symphony can execute.

## Install

```bash
cd /root/clawd/github/active/linear-tasks
npm install
npm run build
openclaw plugins install .
```

## Minimal Config

```yaml
plugins:
  linear-tasks:
    apiKey: "lin_api_..."
    defaultTeamKey: "TIN"
    defaultProject: "claw-tasks"
    defaultState: "Todo"
    defaultPriority: 3
```

## Recommended Runtime Defaults

- `defaultTeamKey`: `TIN`
- `defaultProject`: `claw-tasks`
- `defaultState`: `Todo`
- `defaultPriority`: `3`

These defaults match the current `claw-tasks` intake flow and reduce repeated parameters on each tool call.

## Usage Pattern

1. Call `linear_task` with `action: "preview"` while framing the task.
2. Check that `context`, `goal`, `acceptanceCriteria`, and `validation` are specific enough.
3. Call `linear_task` with `action: "create"` once the task body is ready.
4. Let Symphony pick up the resulting Linear issue from the `claw-tasks` project.

## Required Inputs For Create

- `title`
- `context`
- `goal`
- `acceptanceCriteria` with at least one item
- `validation` with at least one item

If any of these are missing, the tool will reject the create request.

