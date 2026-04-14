export type TaskTemplateInput = {
  summary?: string;
  context?: string;
  goal?: string;
  inScope?: string[];
  outOfScope?: string[];
  acceptanceCriteria?: string[];
  validation?: string[];
  inputs?: string[];
  constraints?: string[];
  expectedOutput?: string[];
  notes?: string[];
};

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}`.trimEnd();
}

function bulletList(values: string[]): string {
  return values.map((value) => `- ${value}`).join("\n");
}

function checklist(values: string[]): string {
  return values.map((value) => `- [ ] ${value}`).join("\n");
}

function optionalParagraph(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function buildIssueDescription(input: TaskTemplateInput): string {
  const parts: string[] = [];

  parts.push(section("Summary", optionalParagraph(input.summary, "No summary provided.")));
  parts.push(section("Context", optionalParagraph(input.context, "No context provided.")));
  parts.push(section("Goal", optionalParagraph(input.goal, "No goal provided.")));

  parts.push(section(
    "Scope",
    [
      "### In Scope",
      "",
      input.inScope?.length ? bulletList(input.inScope) : "- No in-scope items provided.",
      "",
      "### Out of Scope",
      "",
      input.outOfScope?.length ? bulletList(input.outOfScope) : "- No out-of-scope items provided.",
    ].join("\n"),
  ));

  parts.push(section(
    "Acceptance Criteria",
    input.acceptanceCriteria?.length ? checklist(input.acceptanceCriteria) : "- [ ] No acceptance criteria provided.",
  ));

  parts.push(section(
    "Validation",
    input.validation?.length ? checklist(input.validation) : "- [ ] No validation steps provided.",
  ));

  parts.push(section(
    "Inputs / References",
    input.inputs?.length ? bulletList(input.inputs) : "- No inputs or references provided.",
  ));

  parts.push(section(
    "Constraints",
    input.constraints?.length ? bulletList(input.constraints) : "- No constraints provided.",
  ));

  parts.push(section(
    "Expected Output",
    input.expectedOutput?.length ? bulletList(input.expectedOutput) : "- No expected output provided.",
  ));

  parts.push(section(
    "Notes",
    input.notes?.length ? bulletList(input.notes) : "No additional notes.",
  ));

  return `${parts.join("\n\n")}\n`;
}

