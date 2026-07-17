import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wifiCsiTools } from "../providers/wifi-csi.js";

const toolMap = new Map(wifiCsiTools.map((t) => [t.name, t]));

const analyzeWifiCsi: ToolDef = {
  name: "analyze_wifi_csi",
  description:
    "Composite tool for WiFi Channel State Information (CSI) sensing analysis. Supports modes: techniques (CSI sensing overview), privacy (privacy implications), detect (CSI surveillance detection).",
  schema: {
    mode: z
      .enum(["techniques", "privacy", "detect"])
      .describe("Mode: techniques, privacy, or detect"),
    scenario: z
      .enum(["home", "office", "public"])
      .optional()
      .describe("Environment scenario for privacy mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "techniques": {
        const tool = toolMap.get("wifi_csi_techniques")!;
        return tool.execute({}, ctx);
      }
      case "privacy": {
        if (!args.scenario) return text("privacy mode requires 'scenario' parameter (home, office, or public).");
        const tool = toolMap.get("wifi_csi_privacy")!;
        return tool.execute({ scenario: args.scenario }, ctx);
      }
      case "detect": {
        const tool = toolMap.get("wifi_csi_detect")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: techniques, privacy, or detect.`);
    }
  },
};

export default analyzeWifiCsi;
