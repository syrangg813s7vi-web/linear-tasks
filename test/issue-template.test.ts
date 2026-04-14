import { describe, expect, it } from "vitest";
import { buildIssueDescription } from "../src/issue-template.js";

describe("buildIssueDescription", () => {
  it("renders the agreed section structure", () => {
    const description = buildIssueDescription({
      summary: "Create a task template for Linear intake.",
      context: "OpenClaw needs a stable issue format.",
      goal: "Produce a template Symphony can execute directly.",
      inScope: ["Define required fields"],
      outOfScope: ["Implement auto-routing"],
      acceptanceCriteria: ["Template includes goal and validation"],
      validation: ["Preview one sample issue"],
      inputs: ["claw-tasks workflow"],
      constraints: ["Keep the template concise"],
      expectedOutput: ["A reusable issue body"],
      notes: ["Use markdown headings"],
    });

    expect(description).toContain("## Summary");
    expect(description).toContain("## Context");
    expect(description).toContain("## Goal");
    expect(description).toContain("## Scope");
    expect(description).toContain("## Acceptance Criteria");
    expect(description).toContain("- [ ] Template includes goal and validation");
    expect(description).toContain("## Validation");
    expect(description).toContain("## Expected Output");
  });
});
