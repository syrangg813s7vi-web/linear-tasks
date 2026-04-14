# linear-tasks

`linear-tasks` is a thin OpenClaw skill package for standardizing Linear task intake.

It is intended for the workflow:

- OpenClaw receives a task request
- `linear-tasks` provides the agreed issue template and intake rules
- `openclaw-linear` creates the issue in Linear through `linear_issue`
- Symphony picks the issue up and executes it

## Dependency

This package does not create or update Linear issues by itself.

It is designed to be used with `openclaw-linear`, specifically:

- `linear_issue`
- optionally `linear_comment`, `linear_project`, and other follow-up tools from `openclaw-linear`

## Required Structure

When creating a task issue, the final description should include:

- `Summary`
- `Context`
- `Goal`
- `Scope`
- `Acceptance Criteria`
- `Validation`
- `Inputs / References`
- `Constraints`
- `Expected Output`
- `Notes`

Minimum required sections:

- `Context`
- `Goal`
- `Acceptance Criteria`
- `Validation`

## Install

```bash
cd /root/clawd/github/active/linear-tasks
openclaw plugins install .
```

See [docs/openclaw-setup.md](/root/clawd/github/active/linear-tasks/docs/openclaw-setup.md) for the recommended setup with `openclaw-linear`.

## Usage

Use the template in [examples/issue-body-template.md](/root/clawd/github/active/linear-tasks/examples/issue-body-template.md), then create the issue with `openclaw-linear`:

```json
{
  "action": "create",
  "title": "define openclaw linear intake template",
  "description": "<rendered markdown issue body>",
  "team": "TIN",
  "project": "claw-tasks",
  "state": "Todo",
  "priority": 3
}
```

Recommended split:

- `linear-tasks` for intake and issue creation
- `openclaw-linear` for webhook routing, queue handling, comments, and ongoing issue operations

Reusable example payloads:

- [examples/create-task.json](/root/clawd/github/active/linear-tasks/examples/create-task.json)
- [examples/issue-body-template.md](/root/clawd/github/active/linear-tasks/examples/issue-body-template.md)
