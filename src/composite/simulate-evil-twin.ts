import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { evilTwinTools } from "../providers/evil-twin.js";

export const simulateEvilTwinComposite: ToolDef = {
  name: "simulate_evil_twin",
  description: "Evil Twin attack planning and defense. Plan attacks, configure EAP credential capture, design captive portals, generate detection rules.",
  schema: {
    mode: z.enum(["plan", "eap_capture", "captive_portal", "detect"]).describe("Mode: plan attack, capture EAP creds, design portal, or detect/defend"),
    target_ssid: z.string().optional().describe("Target SSID (for plan, eap_capture modes)"),
    target_encryption: z.string().optional().describe("Target encryption (for plan mode)"),
    target_channel: z.number().optional().describe("Target channel (for plan mode)"),
    deauth_needed: z.boolean().optional().describe("Whether deauth is needed (for plan mode)"),
    eap_method: z.string().optional().describe("EAP method (for eap_capture mode)"),
    portal_type: z.string().optional().describe("Portal type: login/update/terms (for captive_portal mode)"),
    target_org: z.string().optional().describe("Target org name (for captive_portal mode)"),
    environment: z.string().optional().describe("Environment description (for detect mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      plan: "evil_twin_plan",
      eap_capture: "evil_twin_eap_capture",
      captive_portal: "evil_twin_captive_portal",
      detect: "evil_twin_detect",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = evilTwinTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in evil-twin provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "plan":
        if (!args.target_ssid || !args.target_encryption) {
          return json({ error: "target_ssid and target_encryption are required for plan mode." });
        }
        break;
      case "eap_capture":
        if (!args.target_ssid || !args.eap_method) {
          return json({ error: "target_ssid and eap_method are required for eap_capture mode." });
        }
        break;
      case "captive_portal":
        if (!args.portal_type || !args.target_org) {
          return json({ error: "portal_type and target_org are required for captive_portal mode." });
        }
        break;
      case "detect":
        if (!args.environment) {
          return json({ error: "environment is required for detect mode." });
        }
        break;
    }

    return tool.execute(args, ctx);
  },
};
