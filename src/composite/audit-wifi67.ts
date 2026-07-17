import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wifi67Tools } from "../providers/wifi67.js";

export const auditWifi67Composite: ToolDef = {
  name: "audit_wifi67",
  description: "WiFi 6/6E/7 security audit. Assess WiFi 6 features, WiFi 7 MLO security, compare generations, analyze new attack surfaces.",
  schema: {
    mode: z.enum(["wifi6_assess", "wifi7_assess", "compare", "attack_surface"]).describe("Mode: assess WiFi 6, assess WiFi 7 MLO, compare 6/6E/7, or analyze new attack surface"),
    features_enabled: z.array(z.string()).optional().describe("WiFi 6 features list (for wifi6_assess mode)"),
    mlo_enabled: z.boolean().optional().describe("MLO enabled (for wifi7_assess mode)"),
    bands: z.array(z.string()).optional().describe("Active bands (for wifi7_assess mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      wifi6_assess: "wifi6_assess",
      wifi7_assess: "wifi7_assess",
      compare: "wifi67_compare",
      attack_surface: "wifi67_new_attack_surface",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = wifi67Tools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in wifi67 provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "wifi6_assess":
        if (!args.features_enabled || (args.features_enabled as string[]).length === 0) {
          return json({ error: "features_enabled array is required for wifi6_assess mode (e.g. ['OFDMA', 'TWT', 'BSS Coloring'])." });
        }
        break;
      case "wifi7_assess":
        if (args.mlo_enabled === undefined || !args.bands || (args.bands as string[]).length === 0) {
          return json({ error: "mlo_enabled and bands array are required for wifi7_assess mode." });
        }
        break;
      // compare and attack_surface: no required params
    }

    return tool.execute(args, ctx);
  },
};
