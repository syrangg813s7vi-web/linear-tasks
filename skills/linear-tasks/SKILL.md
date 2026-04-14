---
name: linear-tasks
description: Create Linear issues from the standard OpenClaw task template so Symphony can pick them up with clear context, acceptance criteria, validation, and expected output.
metadata: { "openclaw": { "always": true, "emoji": "🧾", "requires": { "config": ["extensions.linear-tasks"] } } }
---

# Linear Tasks

Use `linear_task` when OpenClaw needs to send a new executable task into Linear.

## Tool

### `linear_task`

| Action | Purpose |
|---|---|
| `preview` | Render the final issue body without creating the issue. |
| `create` | Render the issue body and create the issue in Linear. |

Required:

- `title`

Strongly recommended fields:

- `context`
- `goal`
- `acceptanceCriteria`
- `validation`

Optional structured fields:

- `summary`
- `inScope`
- `outOfScope`
- `inputs`
- `constraints`
- `expectedOutput`
- `notes`
- `team`
- `project`
- `state`
- `priority`
- `labels`

## Working rule

When creating a task:

1. Make the title specific and action-oriented.
2. Fill `context`, `goal`, `acceptanceCriteria`, and `validation` before calling `create`.
3. Use `preview` first if the task framing is still being checked.
4. Use actual newlines in any long text fields.

