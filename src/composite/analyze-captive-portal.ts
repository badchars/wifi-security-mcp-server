import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { text } from "../types/index.js";
import { captivePortalTools } from "../providers/captive-portal.js";

const toolMap: Record<string, ToolDef> = {
  bypass: captivePortalTools[0],
  assess: captivePortalTools[1],
  defense: captivePortalTools[2],
};

export const analyzeCaptivePortal: ToolDef = {
  name: "analyze_captive_portal",
  description:
    "Unified captive portal analysis tool. Modes: bypass (bypass techniques by portal type), assess (security assessment of portal implementation), defense (hardening recommendations by deployment type).",
  schema: {
    mode: z.enum(["bypass", "assess", "defense"]).describe("Operation mode to execute"),
    portal_type: z.enum(["mac_based", "browser_redirect", "dns_based"]).optional().describe("Type of captive portal (required for bypass mode)"),
    network_restrictions: z.string().optional().describe("Known network restrictions (used by bypass mode)"),
    implementation_details: z.string().optional().describe("Portal implementation description (required for assess mode)"),
    deployment: z.enum(["hotel", "airport", "corporate_guest"]).optional().describe("Deployment environment (required for defense mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;
    const tool = toolMap[mode];

    if (!tool) {
      return text(`Unknown mode: '${mode}'. Valid modes: ${Object.keys(toolMap).join(", ")}`);
    }

    return tool.execute(args, ctx);
  },
};
