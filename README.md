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

## Config

```yaml
plugins:
  linearTasks:
    apiKey: "lin_api_..."
    defaultTeamKey: "TIN"
    defaultProject: "claw-tasks"
    defaultState: "Todo"
    defaultPriority: 3
```

