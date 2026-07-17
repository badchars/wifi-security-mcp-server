import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { zigbeeTools } from "../providers/zigbee.js";

const toolMap = new Map(zigbeeTools.map((t) => [t.name, t]));

const analyzeZigbee: ToolDef = {
  name: "analyze_zigbee",
  description:
    "Composite tool for Zigbee network security analysis. Supports modes: analyze (assess network security), sniff_guide (sniffing setup guide), key_extract (key extraction during join), replay (frame replay guide).",
  schema: {
    mode: z
      .enum(["analyze", "sniff_guide", "key_extract", "replay"])
      .describe("Analysis mode: analyze, sniff_guide, key_extract, or replay"),
    network_key_known: z
      .boolean()
      .optional()
      .describe("Whether network key is known (for analyze mode)"),
    security_level: z
      .enum(["none", "network", "aps"])
      .optional()
      .describe("Zigbee security level (for analyze mode)"),
    coordinator_info: z
      .string()
      .optional()
      .describe("Coordinator info (for analyze mode)"),
    channel: z
      .number()
      .optional()
      .describe("Zigbee channel 11-26 (for sniff_guide mode)"),
    hardware: z
      .enum(["ti_cc2531", "apimote", "hackrf"])
      .optional()
      .describe("Sniffing hardware (for sniff_guide mode)"),
    join_method: z
      .enum(["tc_link_key", "install_code"])
      .optional()
      .describe("Join method (for key_extract mode)"),
    target_device_type: z
      .enum(["lock", "light", "sensor"])
      .optional()
      .describe("Target device type (for replay mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "analyze": {
        if (args.network_key_known === undefined || !args.security_level) {
          return text("analyze mode requires 'network_key_known' and 'security_level' parameters.");
        }
        const tool = toolMap.get("zigbee_analyze")!;
        return tool.execute({
          network_key_known: args.network_key_known,
          security_level: args.security_level,
          coordinator_info: args.coordinator_info,
        }, ctx);
      }
      case "sniff_guide": {
        if (!args.channel) return text("sniff_guide mode requires 'channel' parameter (11-26).");
        const tool = toolMap.get("zigbee_sniff_guide")!;
        return tool.execute({ channel: args.channel, hardware: args.hardware }, ctx);
      }
      case "key_extract": {
        if (!args.join_method) return text("key_extract mode requires 'join_method' parameter (tc_link_key or install_code).");
        const tool = toolMap.get("zigbee_key_extract")!;
        return tool.execute({ join_method: args.join_method }, ctx);
      }
      case "replay": {
        if (!args.target_device_type) return text("replay mode requires 'target_device_type' parameter (lock, light, or sensor).");
        const tool = toolMap.get("zigbee_replay_guide")!;
        return tool.execute({ target_device_type: args.target_device_type }, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: analyze, sniff_guide, key_extract, or replay.`);
    }
  },
};

export default analyzeZigbee;
