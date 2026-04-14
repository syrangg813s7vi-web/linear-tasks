const API_URL = "https://api.linear.app/graphql";

let apiKey: string | undefined;

export function setApiKey(key: string): void {
  apiKey = key;
}

export function getApiKey(): string {
  if (!apiKey) {
    throw new Error("Linear API key not set");
  }
  return apiKey;
}

export async function graphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Linear API HTTP ${res.status}: ${res.statusText}${body ? `: ${body}` : ""}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(`Linear API error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error("Linear API returned no data");
  }

  return json.data;
}

export async function resolveTeamId(teamKey: string): Promise<string> {
  const data = await graphql<{
    teams: { nodes: { id: string }[] };
  }>(
    `query($key: String!) {
      teams(filter: { key: { eq: $key } }) {
        nodes { id }
      }
    }`,
    { key: teamKey.toUpperCase() },
  );

  if (data.teams.nodes.length === 0) {
    throw new Error(`Team with key "${teamKey}" not found`);
  }

  return data.teams.nodes[0].id;
}

export async function resolveStateId(teamId: string, stateName: string): Promise<string> {
  const data = await graphql<{
    team: { states: { nodes: { id: string; name: string }[] } | null } | null;
  }>(
    `query($teamId: String!) {
      team(id: $teamId) {
        states { nodes { id name } }
      }
    }`,
    { teamId },
  );

  const nodes = data.team?.states?.nodes ?? [];
  const matched = nodes.find((node) => node.name.toLowerCase() === stateName.toLowerCase());
  if (!matched) {
    const available = nodes.map((node) => node.name).join(", ");
    throw new Error(`Workflow state "${stateName}" not found. Available states: ${available}`);
  }
  return matched.id;
}

export async function resolveProjectId(projectName: string): Promise<string> {
  const data = await graphql<{
    projects: { nodes: { id: string }[] };
  }>(
    `query($name: String!) {
      projects(filter: { name: { eqIgnoreCase: $name } }) {
        nodes { id }
      }
    }`,
    { name: projectName },
  );

  if (data.projects.nodes.length === 0) {
    throw new Error(`Project "${projectName}" not found`);
  }
  return data.projects.nodes[0].id;
}

export async function resolveLabelIds(teamId: string, labelNames: string[]): Promise<string[]> {
  if (labelNames.length === 0) return [];

  const data = await graphql<{
    team: { labels: { nodes: { id: string; name: string }[] } | null } | null;
  }>(
    `query($teamId: String!) {
      team(id: $teamId) {
        labels { nodes { id name } }
      }
    }`,
    { teamId },
  );

  const map = new Map((data.team?.labels?.nodes ?? []).map((label) => [label.name.toLowerCase(), label.id]));
  return labelNames.map((labelName) => {
    const id = map.get(labelName.toLowerCase());
    if (!id) {
      throw new Error(`Label "${labelName}" not found in team`);
    }
    return id;
  });
}

