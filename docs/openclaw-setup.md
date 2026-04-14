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

## Use With `openclaw-linear`

`linear-tasks` and `openclaw-linear` can run side by side.

Recommended split:

- `linear-tasks`
  - turns an intake request into a templated Linear issue
  - owns the task description contract
- `openclaw-linear`
  - owns webhook intake, queueing, comments, project queries, and issue follow-up work

Example combined config:

```yaml
plugins:
  linear:
    apiKey: "lin_api_..."
    webhookSecret: "your-linear-webhook-secret"
    agentMapping:
      "linear-user-id": "your-openclaw-agent-id"
    teamIds: ["TIN"]
    eventFilter: ["Issue", "Comment"]

  linear-tasks:
    apiKey: "lin_api_..."
    defaultTeamKey: "TIN"
    defaultProject: "claw-tasks"
    defaultState: "Todo"
    defaultPriority: 3
```

The important point is that the plugin ids are different:

- `linear` for `openclaw-linear`
- `linear-tasks` for this plugin

They do not conflict as long as both are configured under their own ids.

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
