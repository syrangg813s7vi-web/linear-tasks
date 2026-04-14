# OpenClaw Setup

Use this spec when OpenClaw should standardize a task request before handing issue creation to `openclaw-linear`.

## Install

```bash
cd /root/clawd/github/active/linear-tasks
openclaw plugins install .
```

## Runtime Model

- `linear-tasks` provides the intake rules, template, and examples
- `openclaw-linear` performs the actual Linear operations

## Use With `openclaw-linear`

`linear-tasks` and `openclaw-linear` can run side by side.

Recommended split:

- `linear-tasks`
  - turns an intake request into a templated issue draft
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

```

The important point is that the plugin ids are different:

- `linear` for `openclaw-linear`
- `linear-tasks` is this spec package's id, but it does not require runtime config

They do not conflict because only `openclaw-linear` owns the live Linear integration.

## Usage Pattern

1. Use [examples/issue-body-template.md](/root/clawd/github/active/linear-tasks/examples/issue-body-template.md) to draft the issue body.
2. Ensure `Context`, `Goal`, `Acceptance Criteria`, and `Validation` are filled.
3. Use `openclaw-linear`'s `linear_issue` with `action: "create"` to submit the issue.
4. Let Symphony pick up the resulting Linear issue from the `claw-tasks` project.
