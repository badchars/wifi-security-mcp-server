import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { wpaAnalysisTools } from "../providers/wpa-analysis.js";

export const analyzeWifiSecurityComposite: ToolDef = {
  name: "analyze_wifi_security",
  description: "Comprehensive WiFi security analysis -- WPA/WPA2/WPA3 configuration assessment, PSK strength, EAP security, PMF status, protocol comparison, crack time estimation.",
  schema: {
    mode: z.enum(["psk_strength", "eap_config", "pmf_check", "compare_protocols", "crack_time"]).describe("Analysis mode"),
    psk: z.string().optional().describe("PSK key or description (for psk_strength mode)"),
    eap_method: z.string().optional().describe("EAP method (for eap_config mode)"),
    inner_method: z.string().optional().describe("Inner auth method (for eap_config mode)"),
    cert_validation: z.boolean().optional().describe("Certificate validation (for eap_config mode)"),
    pmf_status: z.string().optional().describe("PMF status: disabled/optional/required (for pmf_check mode)"),
    protocols: z.array(z.string()).optional().describe("Protocol list to compare (for compare_protocols mode)"),
    hash_type: z.string().optional().describe("Hash type: PMKID/handshake (for crack_time mode)"),
    hardware: z.string().optional().describe("Hardware description (for crack_time mode)"),
    psk_policy: z.string().optional().describe("PSK policy description (for crack_time mode)"),
  },
  async execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const mode = args.mode as string;

    const toolMap: Record<string, string> = {
      psk_strength: "wpa_assess_psk_strength",
      eap_config: "wpa_analyze_eap_config",
      pmf_check: "wpa_check_pmf",
      compare_protocols: "wpa_compare_protocols",
      crack_time: "wpa_crack_time_estimate",
    };

    const toolName = toolMap[mode];
    if (!toolName) {
      return json({ error: `Unknown mode: ${mode}. Available: ${Object.keys(toolMap).join(", ")}` });
    }

    const tool = wpaAnalysisTools.find((t) => t.name === toolName);
    if (!tool) {
      return json({ error: `Tool ${toolName} not found in wpa-analysis provider.` });
    }

    // Validate required params per mode
    switch (mode) {
      case "psk_strength":
        if (!args.psk) {
          return json({ error: "psk is required for psk_strength mode. Provide the key or a description like '8 char numeric'." });
        }
        break;
      case "eap_config":
        if (!args.eap_method) {
          return json({ error: "eap_method is required for eap_config mode (e.g. PEAP, EAP-TLS, EAP-TTLS)." });
        }
        break;
      case "pmf_check":
        if (!args.pmf_status) {
          return json({ error: "pmf_status is required for pmf_check mode (disabled/optional/required)." });
        }
        break;
      case "compare_protocols":
        if (!args.protocols || (args.protocols as string[]).length === 0) {
          return json({ error: "protocols array is required for compare_protocols mode (e.g. ['WPA2-PSK', 'WPA3-SAE'])." });
        }
        break;
      case "crack_time":
        if (!args.hash_type || !args.hardware) {
          return json({ error: "hash_type and hardware are required for crack_time mode." });
        }
        break;
    }

    return tool.execute(args, ctx);
  },
};
