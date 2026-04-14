---
name: linear-tasks
description: Standardize Linear task intake so OpenClaw can use openclaw-linear to create issues with clear context, acceptance criteria, validation, and expected output.
metadata: { "openclaw": { "always": true, "emoji": "🧾", "requires": { "config": ["extensions.openclaw-linear"] } } }
---

# Linear Tasks

Use this skill when OpenClaw needs to turn a task request into a well-formed Linear issue draft for `openclaw-linear`.

## Required tool

Use `linear_issue` from `openclaw-linear` with `action: "create"`.

## Working rule

When creating a task:

1. Make the title specific and action-oriented.
2. Build the issue description with these sections:
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
3. Treat these as mandatory before creation:
   - `Context`
   - `Goal`
   - `Acceptance Criteria`
   - `Validation`
4. Use actual newlines in the markdown body.
5. Create the issue with `linear_issue`, not with this spec.

## Example

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
