# linear-tasks

`linear-tasks` is a thin OpenClaw plugin for creating Linear issues from a standard task template.

It is intended for the workflow:

- OpenClaw receives a task request
- `linear-tasks` formats the issue body with the agreed template
- The plugin creates the issue in Linear
- Symphony picks the issue up and executes it

## Tool

The plugin registers one tool:

- `linear_task`
  - `preview`: render the final issue body without creating anything
  - `create`: create the Linear issue

For `create`, these fields are required:

- `title`
- `context`
- `goal`
- `acceptanceCriteria` with at least one item
- `validation` with at least one item

## Config

```yaml
plugins:
  linear-tasks:
    apiKey: "lin_api_..."
    defaultTeamKey: "TIN"
    defaultProject: "claw-tasks"
    defaultState: "Todo"
    defaultPriority: 3
```

## Install

```bash
cd /root/clawd/github/active/linear-tasks
npm install
npm run build
openclaw plugins install .
```

See [docs/openclaw-setup.md](/root/clawd/github/active/linear-tasks/docs/openclaw-setup.md) for the recommended OpenClaw config and intake flow.

`linear-tasks` can be enabled together with `openclaw-linear`. The intended split is:

- `linear-tasks` for intake and issue creation
- `openclaw-linear` for webhook routing, queue handling, comments, and ongoing issue operations

## Example

Preview:

```json
{
  "action": "preview",
  "title": "define linear intake template for openclaw tasks",
  "context": "OpenClaw needs a stable way to submit executable tasks into Linear.",
  "goal": "Produce a standard issue body that Symphony can pick up without guessing.",
  "acceptanceCriteria": [
    "The issue includes context, goal, acceptance criteria, and validation",
    "The task stays scoped to intake and does not expand into execution"
  ],
  "validation": [
    "Render the final issue body and inspect the section structure"
  ]
}
```

Create:

```json
{
  "action": "create",
  "title": "define linear intake template for openclaw tasks",
  "context": "OpenClaw needs a stable way to submit executable tasks into Linear.",
  "goal": "Produce a standard issue body that Symphony can pick up without guessing.",
  "acceptanceCriteria": [
    "The issue includes context, goal, acceptance criteria, and validation"
  ],
  "validation": [
    "Create one sample issue in the claw-tasks project"
  ],
  "project": "claw-tasks",
  "state": "Todo",
  "priority": 3
}
```

Reusable example payloads:

- [examples/preview-task.json](/root/clawd/github/active/linear-tasks/examples/preview-task.json)
- [examples/create-task.json](/root/clawd/github/active/linear-tasks/examples/create-task.json)
