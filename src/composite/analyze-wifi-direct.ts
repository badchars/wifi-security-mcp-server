import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wifiDirectTools } from "../providers/wifi-direct.js";

const toolMap = new Map(wifiDirectTools.map((t) => [t.name, t]));

const analyzeWifiDirect: ToolDef = {
  name: "analyze_wifi_direct",
  description:
    "Composite tool for WiFi Direct (P2P) security analysis. Supports modes: assess (assess security posture), attack (attack techniques), defense (hardening recommendations).",
  schema: {
    mode: z
      .enum(["assess", "attack", "defense"])
      .describe("Mode: assess, attack, or defense"),
    go_intent: z
      .number()
      .optional()
      .describe("WiFi Direct Group Owner intent 0-15 (for assess mode)"),
    wps_method: z
      .enum(["pbc", "pin_display", "pin_keypad", "nfc"])
      .optional()
      .describe("WPS method (for assess mode)"),
    persistent_group: z
      .boolean()
      .optional()
      .describe("Persistent group enabled (for assess mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "assess": {
        if (args.go_intent === undefined || !args.wps_method) {
          return text("assess mode requires 'go_intent' (0-15) and 'wps_method' parameters.");
        }
        const tool = toolMap.get("wifi_direct_assess")!;
        return tool.execute({
          go_intent: args.go_intent,
          wps_method: args.wps_method,
          persistent_group: args.persistent_group,
        }, ctx);
      }
      case "attack": {
        const tool = toolMap.get("wifi_direct_attack")!;
        return tool.execute({}, ctx);
      }
      case "defense": {
        const tool = toolMap.get("wifi_direct_defense")!;
        return tool.execute({}, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: assess, attack, or defense.`);
    }
  },
};

export default analyzeWifiDirect;
