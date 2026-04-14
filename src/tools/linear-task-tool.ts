import { Type, type Static } from "@sinclair/typebox";
import type { AnyAgentTool, OpenClawPluginApi } from "openclaw/plugin-sdk";
import { jsonResult, stringEnum } from "openclaw/plugin-sdk/agent-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { graphql, resolveLabelIds, resolveProjectId, resolveStateId, resolveTeamId } from "../linear-api.js";
import { buildIssueDescription } from "../issue-template.js";

const Params = Type.Object({
  action: stringEnum(["preview", "create"] as const, {
    description: "preview renders the issue body only. create renders and creates the Linear issue.",
  }),
  title: Type.String({
    description: "Issue title.",
  }),
  summary: Type.Optional(Type.String()),
  context: Type.Optional(Type.String()),
  goal: Type.Optional(Type.String()),
  inScope: Type.Optional(Type.Array(Type.String())),
  outOfScope: Type.Optional(Type.Array(Type.String())),
  acceptanceCriteria: Type.Optional(Type.Array(Type.String())),
  validation: Type.Optional(Type.Array(Type.String())),
  inputs: Type.Optional(Type.Array(Type.String())),
  constraints: Type.Optional(Type.Array(Type.String())),
  expectedOutput: Type.Optional(Type.Array(Type.String())),
  notes: Type.Optional(Type.Array(Type.String())),
  team: Type.Optional(Type.String({
    description: "Linear team key. Falls back to plugin defaultTeamKey.",
  })),
  project: Type.Optional(Type.String({
    description: "Linear project name. Falls back to plugin defaultProject.",
  })),
  state: Type.Optional(Type.String({
    description: "Linear workflow state name. Falls back to plugin defaultState.",
  })),
  priority: Type.Optional(Type.Number({
    description: "0=None, 1=Urgent, 2=High, 3=Medium, 4=Low. Falls back to plugin defaultPriority.",
  })),
  labels: Type.Optional(Type.Array(Type.String())),
});

type Params = Static<typeof Params>;

type PluginDefaults = {
  defaultTeamKey?: string;
  defaultProject?: string;
  defaultState?: string;
  defaultPriority?: number;
};

export function createLinearTaskTool(api: OpenClawPluginApi): AnyAgentTool {
  const defaults: PluginDefaults = {
    defaultTeamKey: asString(api.pluginConfig?.defaultTeamKey),
    defaultProject: asString(api.pluginConfig?.defaultProject),
    defaultState: asString(api.pluginConfig?.defaultState),
    defaultPriority: asNumber(api.pluginConfig?.defaultPriority),
  };

  return {
    name: "linear_task",
    label: "Linear Task",
    description: "Render or create a Linear issue using the standard OpenClaw task template.",
    parameters: Params,
    async execute(_toolCallId: string, params: Params) {
      try {
        const description = buildIssueDescription({
          summary: params.summary,
          context: params.context,
          goal: params.goal,
          inScope: params.inScope,
          outOfScope: params.outOfScope,
          acceptanceCriteria: params.acceptanceCriteria,
          validation: params.validation,
          inputs: params.inputs,
          constraints: params.constraints,
          expectedOutput: params.expectedOutput,
          notes: params.notes,
        });

        if (params.action === "preview") {
          return jsonResult({
            title: params.title,
            description,
            team: params.team ?? defaults.defaultTeamKey ?? null,
            project: params.project ?? defaults.defaultProject ?? null,
            state: params.state ?? defaults.defaultState ?? null,
            priority: params.priority ?? defaults.defaultPriority ?? null,
          });
        }

        const validationError = validateCreateParams(params);
        if (validationError) {
          return jsonResult({ error: validationError });
        }

        const teamKey = params.team ?? defaults.defaultTeamKey;
        if (!teamKey) {
          return jsonResult({ error: "team is required when no defaultTeamKey is configured" });
        }

        const teamId = await resolveTeamId(teamKey);
        const input: Record<string, unknown> = {
          title: params.title,
          description,
          teamId,
        };

        const stateName = params.state ?? defaults.defaultState;
        if (stateName) {
          input.stateId = await resolveStateId(teamId, stateName);
        }

        const projectName = params.project ?? defaults.defaultProject;
        if (projectName) {
          input.projectId = await resolveProjectId(projectName);
        }

        const priority = params.priority ?? defaults.defaultPriority;
        if (priority !== undefined) {
          input.priority = priority;
        }

        if (params.labels?.length) {
          input.labelIds = await resolveLabelIds(teamId, params.labels);
        }

        const data = await graphql<{
          issueCreate: {
            success: boolean;
            issue: {
              id: string;
              identifier: string;
              title: string;
              url: string;
            } | null;
          };
        }>(
          `mutation($input: IssueCreateInput!) {
            issueCreate(input: $input) {
              success
              issue {
                id
                identifier
                title
                url
              }
            }
          }`,
          { input },
        );

        return jsonResult({
          success: data.issueCreate.success,
          issue: data.issueCreate.issue,
          description,
        });
      } catch (error) {
        return jsonResult({
          error: `linear_task error: ${formatErrorMessage(error)}`,
        });
      }
    },
  };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function validateCreateParams(params: Params): string | null {
  if (!hasText(params.context)) {
    return "context is required for create";
  }
  if (!hasText(params.goal)) {
    return "goal is required for create";
  }
  if (!hasNonEmptyArray(params.acceptanceCriteria)) {
    return "acceptanceCriteria must contain at least one item for create";
  }
  if (!hasNonEmptyArray(params.validation)) {
    return "validation must contain at least one item for create";
  }
  return null;
}

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyArray(value: string[] | undefined): boolean {
  return Array.isArray(value) && value.some((item) => item.trim().length > 0);
}
