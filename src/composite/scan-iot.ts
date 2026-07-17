import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { iotProtocolTools } from "../providers/iot-protocol.js";

const toolMap = new Map(iotProtocolTools.map((t) => [t.name, t]));

const scanIotWireless: ToolDef = {
  name: "scan_iot_wireless",
  description:
    "Composite tool for IoT wireless protocol security scanning. Supports modes: lookup (look up attack by ID), search (search attacks by protocol/category), assess_protocol (assess protocol security), scan_guide (scanning setup guide), defense (defense recommendations).",
  schema: {
    mode: z
      .enum(["lookup", "search", "assess_protocol", "scan_guide", "defense"])
      .describe("Scan mode: lookup, search, assess_protocol, scan_guide, or defense"),
    attack_id: z
      .string()
      .optional()
      .describe("Attack ID for lookup mode"),
    protocol: z
      .enum(["zigbee", "zwave", "mqtt", "lora", "coap", "thread", "matter"])
      .optional()
      .describe("IoT protocol for search, assess_protocol, scan_guide, and defense modes"),
    category: z
      .enum(["replay", "injection", "sniffing", "key_extract", "dos", "firmware", "mitm"])
      .optional()
      .describe("Attack category filter for search mode"),
    version: z
      .string()
      .optional()
      .describe("Protocol version for assess_protocol mode"),
    encryption_enabled: z
      .boolean()
      .optional()
      .describe("Encryption status for assess_protocol mode"),
    hardware: z
      .string()
      .optional()
      .describe("Available hardware for scan_guide mode"),
    deployment_type: z
      .enum(["home", "enterprise", "industrial"])
      .optional()
      .describe("Deployment type for defense mode"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    switch (mode) {
      case "lookup": {
        if (!args.attack_id) return text("lookup mode requires 'attack_id' parameter.");
        const tool = toolMap.get("iot_lookup_attack")!;
        return tool.execute({ attack_id: args.attack_id }, ctx);
      }
      case "search": {
        const tool = toolMap.get("iot_search_attacks")!;
        return tool.execute({ protocol: args.protocol, category: args.category }, ctx);
      }
      case "assess_protocol": {
        if (!args.protocol) return text("assess_protocol mode requires 'protocol' parameter.");
        const tool = toolMap.get("iot_assess_protocol")!;
        return tool.execute({
          protocol: args.protocol,
          version: args.version,
          encryption_enabled: args.encryption_enabled,
        }, ctx);
      }
      case "scan_guide": {
        if (!args.protocol) return text("scan_guide mode requires 'protocol' parameter.");
        const tool = toolMap.get("iot_scan_guide")!;
        return tool.execute({ protocol: args.protocol, hardware: args.hardware }, ctx);
      }
      case "defense": {
        if (!args.protocol || !args.deployment_type) {
          return text("defense mode requires 'protocol' and 'deployment_type' parameters.");
        }
        const tool = toolMap.get("iot_defense")!;
        return tool.execute({ protocol: args.protocol, deployment_type: args.deployment_type }, ctx);
      }
      default:
        return text(`Unknown mode: ${mode}. Use: lookup, search, assess_protocol, scan_guide, or defense.`);
    }
  },
};

export default scanIotWireless;
