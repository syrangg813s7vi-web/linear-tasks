import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { setApiKey } from "./linear-api.js";
import { createLinearTaskTool } from "./tools/linear-task-tool.js";

export function activate(api: OpenClawPluginApi): void {
  api.logger.info("linear-tasks plugin activated");

  const apiKey = api.pluginConfig?.apiKey;
  if (typeof apiKey !== "string" || apiKey.length === 0) {
    api.logger.error("[linear-tasks] apiKey is not configured");
    return;
  }

  setApiKey(apiKey);
  api.registerTool(createLinearTaskTool(api));
}

