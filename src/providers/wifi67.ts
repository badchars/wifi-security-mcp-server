import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS, WIRELESS_CVES } from "../knowledge/index.js";

const wifi6_assess: ToolDef = {
  name: "wifi6_assess",
  description: "Assess WiFi 6 (802.11ax) and WiFi 6E specific security implications. Evaluates enabled features like OFDMA, BSS Coloring, and TWT for new attack surfaces and known CVEs.",
  schema: {
    features_enabled: z.array(z.string()).describe("Enabled WiFi 6/6E features (e.g. ['OFDMA', 'BSS Coloring', 'TWT', 'MU-MIMO', '1024-QAM', '6GHz'])"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const features = (args.features_enabled as string[]).map((f) => f.toUpperCase());

    type FeatureAnalysis = {
      feature: string;
      enabled: boolean;
      attack_surface: string[];
      known_vulnerabilities: string[];
      security_benefits: string[];
      recommendations: string[];
    };

    const featureAnalyses: FeatureAnalysis[] = [];

    // OFDMA
    featureAnalyses.push({
      feature: "OFDMA (Orthogonal Frequency-Division Multiple Access)",
      enabled: features.some((f) => f.includes("OFDMA")),
      attack_surface: [
        "Timing side-channel: OFDMA scheduling reveals client activity patterns",
        "Resource Unit (RU) allocation analysis leaks number and type of active clients",
        "Trigger frame injection can disrupt scheduled transmissions",
        "Power analysis across subcarriers can fingerprint devices",
      ],
      known_vulnerabilities: [
        "CVE-2022-47522: Power-save mode frame injection affects WiFi 6 devices",
        "Timing analysis of OFDMA scheduling reveals traffic patterns",
      ],
      security_benefits: [
        "OFDMA itself doesn't weaken encryption",
        "Better spectrum utilization reduces need for multiple SSIDs",
      ],
      recommendations: [
        "Monitor for anomalous trigger frames",
        "Apply CVE-2022-47522 patches",
        "Use encrypted DNS (DoH/DoT) to prevent OFDMA timing correlation",
      ],
    });

    // BSS Coloring
    featureAnalyses.push({
      feature: "BSS Coloring (Spatial Reuse)",
      enabled: features.some((f) => f.includes("BSS") || f.includes("COLOR")),
      attack_surface: [
        "BSS Color manipulation can cause spatial reuse misbehavior",
        "Color collision attacks force CCA deferral, creating DoS",
        "Forged BSS Color change announcements disrupt network",
        "BSS Color can be used to fingerprint and track APs",
      ],
      known_vulnerabilities: [
        "BSS Color Change Announcement frame is a management frame - protected by PMF only",
        "Without PMF, BSS Color can be arbitrarily changed by attacker",
      ],
      security_benefits: [
        "Reduces co-channel interference, improving overall network reliability",
        "Does not affect encryption or authentication",
      ],
      recommendations: [
        "Enable PMF to protect BSS Color change management frames",
        "Monitor for unexpected BSS Color changes",
        "Configure unique BSS Colors across managed APs",
      ],
    });

    // TWT (Target Wake Time)
    featureAnalyses.push({
      feature: "TWT (Target Wake Time)",
      enabled: features.some((f) => f.includes("TWT")),
      attack_surface: [
        "TWT schedule reveals device sleep/wake patterns",
        "Predictable wake times allow targeted attacks during active windows",
        "TWT teardown frames can be forged to disrupt power-save schedules",
        "CVE-2022-47522: Frame injection during power-save transitions",
      ],
      known_vulnerabilities: [
        "CVE-2022-47522: Security context manipulation during power-save mode",
        "TWT negotiation frames may reveal device capabilities and usage patterns",
      ],
      security_benefits: [
        "Improved power management for IoT devices",
        "Reduced channel contention",
      ],
      recommendations: [
        "Patch all devices for CVE-2022-47522",
        "Monitor TWT teardown frames for anomalies",
        "Enable PMF to protect TWT management frames",
      ],
    });

    // MU-MIMO
    featureAnalyses.push({
      feature: "MU-MIMO (Multi-User MIMO - Uplink + Downlink)",
      enabled: features.some((f) => f.includes("MIMO")),
      attack_surface: [
        "Beamforming sounding frames can be analyzed for client position estimation",
        "Channel State Information (CSI) leaks physical environment data",
        "MU-MIMO grouping reveals which clients are spatially close",
      ],
      known_vulnerabilities: [
        "CSI-based sensing can detect human presence and activity through walls (WiFi sensing)",
        "Beamforming feedback can be passively captured for environment analysis",
      ],
      security_benefits: [
        "Does not weaken cryptographic security",
        "Improved throughput reduces congestion-related vulnerabilities",
      ],
      recommendations: [
        "Be aware that CSI data can be used for physical surveillance",
        "Consider privacy implications of WiFi sensing capabilities",
      ],
    });

    // 6GHz (WiFi 6E)
    featureAnalyses.push({
      feature: "6GHz Band (WiFi 6E)",
      enabled: features.some((f) => f.includes("6GHZ") || f.includes("6E") || f.includes("6 GHZ")),
      attack_surface: [
        "New frequency band requires WPA3 - but attacker tools for 6GHz are emerging",
        "Preferred Scanning Channel (PSC) mechanism can be exploited for rogue AP",
        "AFC (Automated Frequency Coordination) database queries leak AP location",
        "Limited range of 6GHz can be both advantage and disadvantage for attacks",
      ],
      known_vulnerabilities: [
        "Few known CVEs specific to 6GHz - newer technology with less research",
        "Driver/firmware maturity issues may introduce implementation vulnerabilities",
      ],
      security_benefits: [
        "WPA3 mandatory on 6GHz - no WPA2 fallback",
        "PMF mandatory - deauth attacks blocked",
        "OWE (Opportunistic Wireless Encryption) for open networks",
        "59 non-overlapping 20MHz channels - less congestion",
        "Short range limits drive-by attacks",
      ],
      recommendations: [
        "Use 6GHz for most sensitive communications",
        "Keep firmware updated - 6GHz stack is newer with potential undiscovered bugs",
        "Monitor for rogue APs on PSC channels",
        "Enable AFC where required by regulations",
      ],
    });

    // Find relevant CVEs from KB
    const wifi6Cves = WIRELESS_CVES.filter(
      (c) => c.cveId === "CVE-2022-47522" || c.protocol === "802.11ax" || c.name.toLowerCase().includes("wifi 6")
    );

    const wifi6Attack = WIFI_ATTACKS.find((a) => a.id === "wifi6_ofdma");

    return json({
      wifi6_assessment: {
        features_analyzed: featureAnalyses.filter((f) => f.enabled).length,
        total_features: featureAnalyses.length,
        enabled_features: featureAnalyses.filter((f) => f.enabled).map((f) => f.feature),
        feature_analysis: featureAnalyses.filter((f) => f.enabled),
        disabled_features_note: featureAnalyses.filter((f) => !f.enabled).map((f) => ({
          feature: f.feature,
          note: "Not enabled - attack surface not applicable. Consider enabling for performance benefits.",
        })),
        overall_assessment: {
          new_attack_surfaces: featureAnalyses.filter((f) => f.enabled).flatMap((f) => f.attack_surface),
          critical_cves: wifi6Cves.map((c) => ({
            cve: c.cveId,
            name: c.name,
            severity: c.severity,
            cvss: c.cvss,
            patched: c.patchAvailable,
          })),
          key_recommendations: [
            "Enable PMF (required for WPA3, recommended for WPA2)",
            "Patch all devices for CVE-2022-47522 (power-save frame injection)",
            "Use 6GHz band for sensitive operations (WPA3 mandatory)",
            "Monitor for anomalous management frames targeting WiFi 6 features",
            "Keep firmware updated - WiFi 6 stack is still maturing",
          ],
        },
        kb_reference: wifi6Attack ? {
          id: wifi6Attack.id,
          name: wifi6Attack.name,
          severity: wifi6Attack.severity,
          cves: wifi6Attack.cves,
        } : undefined,
      },
    });
  },
};

const wifi7_assess: ToolDef = {
  name: "wifi7_assess",
  description: "Assess WiFi 7 (802.11be) Multi-Link Operation (MLO) security implications. Evaluates MLO-specific attack vectors and new security considerations.",
  schema: {
    mlo_enabled: z.boolean().describe("Whether Multi-Link Operation is enabled"),
    bands: z.array(z.string()).describe("Active frequency bands (e.g. ['2.4GHz', '5GHz', '6GHz'])"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const mloEnabled = args.mlo_enabled as boolean;
    const bands = args.bands as string[];

    const multipleLinks = bands.length > 1;

    const mloAttackVectors = [
      {
        name: "Cross-Link Traffic Correlation",
        description: "MLO allows simultaneous communication on multiple bands. An attacker monitoring all bands can correlate traffic patterns across links to identify users and activities.",
        severity: "medium",
        prerequisites: ["Monitor mode on all active bands", "WiFi 7 capable monitoring hardware"],
        mitigation: "Use VPN to encrypt all traffic regardless of link",
      },
      {
        name: "Link Switching Manipulation",
        description: "Inject or spoof management frames to force link switching, potentially directing traffic to a band where the attacker has better position.",
        severity: "medium",
        prerequisites: ["PMF bypass or buggy MLO implementation", "Monitor + injection on target band"],
        mitigation: "PMF on all links, firmware updates",
      },
      {
        name: "MLO Setup Frame Injection",
        description: "During MLO association, Multi-Link Setup frames negotiate link parameters. Injection during this phase could manipulate link configuration.",
        severity: "high",
        prerequisites: ["Timing-sensitive injection during MLO association", "WiFi 7 capable attack tools"],
        mitigation: "PMF protects setup frames, use latest firmware",
      },
      {
        name: "Multi-Link Downgrade Attack",
        description: "Force MLO device to fall back to single-link operation, potentially to a less secure or more easily attacked band.",
        severity: "medium",
        prerequisites: ["Ability to disrupt specific band (jamming or deauth on non-PMF link)"],
        mitigation: "Require PMF on all bands, monitor for unexpected link drops",
      },
      {
        name: "Band-Specific Targeting",
        description: "2.4GHz link may have different security posture than 5/6GHz. Target the weakest band.",
        severity: "low",
        prerequisites: ["Target uses mixed-security bands"],
        mitigation: "Uniform security policy across all bands",
      },
      {
        name: "TID-to-Link Mapping Manipulation",
        description: "WiFi 7 maps traffic types (TIDs) to specific links. Manipulation could redirect sensitive traffic to attacker-controlled link.",
        severity: "high",
        prerequisites: ["Ability to inject TID-to-Link negotiation frames"],
        mitigation: "PMF protection, verify TID-to-Link integrity",
      },
    ];

    const newProtocols = [
      {
        protocol: "4096-QAM",
        security_impact: "No direct security impact. Higher modulation = better throughput but same encryption.",
        attack_surface: "Requires higher SNR - may increase sensitivity to signal manipulation.",
      },
      {
        protocol: "320MHz Channels",
        security_impact: "Wider channels may increase exposure to cross-channel interference attacks.",
        attack_surface: "More spectrum to monitor for the attacker, but also more spectrum to jam.",
      },
      {
        protocol: "Multi-RU Puncturing",
        security_impact: "Punctured RUs could be used by attacker if not properly managed.",
        attack_surface: "Puncturing patterns may leak information about interference environment.",
      },
      {
        protocol: "Preamble Puncturing",
        security_impact: "Allows operation despite interference on parts of the channel.",
        attack_surface: "Attacker could force specific puncturing patterns via targeted interference.",
      },
    ];

    const wifi7Attack = WIFI_ATTACKS.find((a) => a.id === "wifi7_mlo");

    return json({
      wifi7_assessment: {
        mlo_enabled: mloEnabled,
        active_bands: bands,
        multi_link: multipleLinks,
        mlo_attack_vectors: mloEnabled ? mloAttackVectors : [{
          note: "MLO is disabled. MLO-specific attack vectors do not apply.",
          recommendation: "MLO provides performance benefits. If disabled for security, consider enabling with PMF on all links.",
        }],
        new_protocol_security: newProtocols,
        band_security_comparison: bands.map((band) => {
          const b = band.toLowerCase();
          if (b.includes("2.4")) {
            return {
              band: "2.4GHz",
              wpa3_required: false,
              pmf_mandatory: false,
              legacy_compatibility: "High - many legacy devices",
              attack_risk: "HIGHER - longer range, more legacy tools available",
              note: "Consider WPA3 transition mode at minimum",
            };
          }
          if (b.includes("5")) {
            return {
              band: "5GHz",
              wpa3_required: false,
              pmf_mandatory: false,
              legacy_compatibility: "Medium",
              attack_risk: "MODERATE - shorter range, DFS channels available",
              note: "Use DFS channels for added obscurity",
            };
          }
          if (b.includes("6")) {
            return {
              band: "6GHz",
              wpa3_required: true,
              pmf_mandatory: true,
              legacy_compatibility: "None - WiFi 6E+ only",
              attack_risk: "LOWER - WPA3 mandatory, short range, limited attack tools",
              note: "Most secure band. Use for sensitive operations.",
            };
          }
          return { band, note: "Unknown band" };
        }),
        overall_recommendations: [
          "Enable PMF (802.11w) on ALL bands - mandatory for 6GHz, should be for others too",
          "Use WPA3-SAE on all bands for uniform security",
          "Monitor for unexpected MLO link state changes",
          "Keep firmware updated - WiFi 7 is newest standard with evolving security research",
          "Use 6GHz for most sensitive traffic (WPA3 mandatory)",
          "Implement WIDS capable of WiFi 7 frame analysis",
          "Test MLO implementation for known attack vectors before deployment",
          multipleLinks
            ? "Ensure consistent security policy across all active bands"
            : "Consider enabling multiple bands for MLO resilience benefits",
        ],
        research_status: "WiFi 7 (802.11be) is a new standard. Security research is ongoing. Expect new attack vectors to be discovered.",
        kb_reference: wifi7Attack ? {
          id: wifi7Attack.id,
          name: wifi7Attack.name,
          severity: wifi7Attack.severity,
          description: wifi7Attack.description,
        } : undefined,
      },
    });
  },
};

const wifi67_compare: ToolDef = {
  name: "wifi67_compare",
  description: "Compare WiFi 6, WiFi 6E, and WiFi 7 security features side by side. Returns a comprehensive feature comparison table.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const comparison = {
      standards: [
        {
          name: "WiFi 6 (802.11ax)",
          release_year: 2020,
          max_speed: "9.6 Gbps",
          bands: ["2.4GHz", "5GHz"],
          channel_width: "160MHz",
          modulation: "1024-QAM",
          key_features: ["OFDMA", "MU-MIMO (UL+DL)", "TWT", "BSS Coloring", "1024-QAM"],
          security: {
            wpa3_support: "Optional",
            pmf_required: "No (only with WPA3)",
            sae: "Optional",
            owe: "Optional",
            encryption: "CCMP-128, GCMP-256 (WPA3)",
            known_cves: ["CVE-2022-47522 (power-save frame injection)"],
          },
          attack_surface: "Moderate - new features add side-channels but fundamentals unchanged",
        },
        {
          name: "WiFi 6E (802.11ax extended)",
          release_year: 2021,
          max_speed: "9.6 Gbps",
          bands: ["2.4GHz", "5GHz", "6GHz"],
          channel_width: "160MHz",
          modulation: "1024-QAM",
          key_features: ["Same as WiFi 6", "6GHz band (1200MHz new spectrum)", "PSC (Preferred Scanning Channels)"],
          security: {
            wpa3_support: "Mandatory on 6GHz",
            pmf_required: "Yes on 6GHz, optional on 2.4/5GHz",
            sae: "Mandatory on 6GHz",
            owe: "Available for open networks on 6GHz",
            encryption: "GCMP-256 (6GHz), CCMP-128 (2.4/5GHz)",
            known_cves: ["Same as WiFi 6 + emerging 6GHz specific issues"],
          },
          attack_surface: "Lower on 6GHz (WPA3 mandatory), same as WiFi 6 on 2.4/5GHz",
        },
        {
          name: "WiFi 7 (802.11be)",
          release_year: 2024,
          max_speed: "46 Gbps",
          bands: ["2.4GHz", "5GHz", "6GHz"],
          channel_width: "320MHz",
          modulation: "4096-QAM",
          key_features: ["MLO", "4096-QAM", "320MHz channels", "Multi-RU", "Preamble Puncturing", "16 Spatial Streams"],
          security: {
            wpa3_support: "Mandatory on 6GHz",
            pmf_required: "Yes on 6GHz",
            sae: "Mandatory on 6GHz",
            owe: "Available",
            encryption: "GCMP-256",
            known_cves: ["Research ongoing - new standard"],
          },
          attack_surface: "MLO introduces new attack surface (cross-link correlation, link manipulation). 6GHz band remains most secure.",
        },
      ],
      security_comparison_matrix: {
        headers: ["Feature", "WiFi 6", "WiFi 6E", "WiFi 7"],
        rows: [
          ["WPA3 Mandatory", "No", "6GHz only", "6GHz only"],
          ["PMF Mandatory", "No", "6GHz only", "6GHz only"],
          ["Deauth Protection", "Optional PMF", "Mandatory on 6GHz", "Mandatory on 6GHz"],
          ["Offline PSK Attack", "Possible (WPA2)", "Not on 6GHz (WPA3)", "Not on 6GHz (WPA3)"],
          ["OFDMA Side-Channel", "Yes", "Yes", "Yes (+ Multi-RU)"],
          ["TWT Timing Attack", "Yes", "Yes", "Yes"],
          ["MLO Attack Surface", "N/A", "N/A", "Yes (new)"],
          ["320MHz Channel", "No", "No", "Yes (wider exposure)"],
          ["Legacy Compatibility", "High", "Medium", "Low"],
          ["Tool Support", "Good", "Growing", "Limited"],
        ],
      },
      recommendations: {
        for_security: [
          "WiFi 6E/7 on 6GHz provides strongest baseline security (WPA3 + PMF mandatory)",
          "For mixed environments, use WPA3 transition mode on 2.4/5GHz",
          "WiFi 7 MLO requires additional monitoring for cross-link attacks",
          "Keep firmware updated - newer standards have more undiscovered vulnerabilities",
        ],
        for_pentesting: [
          "WiFi 6/6E: Focus on OFDMA/TWT side-channels and CVE-2022-47522",
          "WiFi 7: Research MLO attack surface - limited public research available",
          "6GHz: Standard attacks (deauth, handshake capture) are blocked - need WPA3-specific techniques",
          "Tool support for WiFi 7 is still emerging - custom Scapy/nexmon may be needed",
        ],
      },
    };

    return json(comparison);
  },
};

const wifi67_new_attack_surface: ToolDef = {
  name: "wifi67_new_attack_surface",
  description: "Describe new attack surfaces introduced by WiFi 6 and WiFi 7 protocols. Provides detailed analysis of new protocols and their security implications.",
  schema: {},
  async execute(_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const attackSurfaces = [
      {
        category: "OFDMA (WiFi 6/7)",
        description: "Orthogonal Frequency-Division Multiple Access allows AP to divide channel into Resource Units (RUs) for simultaneous multi-user transmission.",
        new_attack_vectors: [
          {
            name: "OFDMA Scheduling Side-Channel",
            description: "By monitoring trigger frames and RU assignments, attacker can determine number of active clients, traffic patterns, and relative data volumes without decrypting traffic.",
            difficulty: "MEDIUM",
            tools: ["Custom Scapy scripts", "nexmon CSI extraction", "GNU Radio"],
            research_status: "Academic papers published, limited practical tools",
          },
          {
            name: "Trigger Frame Injection",
            description: "Inject malicious trigger frames to disrupt scheduled OFDMA transmissions or cause clients to transmit at unexpected times.",
            difficulty: "HIGH",
            tools: ["nexmon (modified firmware)", "Custom FPGA"],
            research_status: "Theoretical, demonstrated in lab",
          },
          {
            name: "RU Exhaustion DoS",
            description: "Exhaust available Resource Units by spoofing multiple clients or flooding buffer status reports.",
            difficulty: "HIGH",
            tools: ["Custom firmware"],
            research_status: "Theoretical",
          },
        ],
      },
      {
        category: "TWT - Target Wake Time (WiFi 6/7)",
        description: "Allows devices to negotiate specific wake times with AP, enabling aggressive power saving.",
        new_attack_vectors: [
          {
            name: "TWT Schedule Fingerprinting",
            description: "TWT schedules are device-specific. Monitoring TWT agreements reveals device types, usage patterns, and sleep schedules.",
            difficulty: "MEDIUM",
            tools: ["Wireshark (TWT frame decode)", "Custom monitor"],
            research_status: "Demonstrated",
          },
          {
            name: "TWT Teardown Attack",
            description: "Send forged TWT teardown frames to disrupt power-save schedules, draining IoT device batteries.",
            difficulty: "MEDIUM",
            tools: ["Scapy with WiFi 6 frame support"],
            research_status: "Demonstrated",
          },
          {
            name: "Power-Save Frame Injection (CVE-2022-47522)",
            description: "Manipulate security context during power-save state transitions to inject frames. Affects WiFi 6 TWT specifically.",
            difficulty: "MEDIUM",
            tools: ["fragattacks (modified)", "Custom tools"],
            research_status: "CVE published, patches available",
          },
        ],
      },
      {
        category: "BSS Coloring (WiFi 6/7)",
        description: "6-bit BSS Color in PHY header enables spatial reuse by allowing devices to ignore frames from other BSSs.",
        new_attack_vectors: [
          {
            name: "BSS Color Collision Attack",
            description: "Broadcast beacons with same BSS Color as target AP. Forces CCA deferral, creating DoS or performance degradation.",
            difficulty: "LOW",
            tools: ["hostapd (modified)", "Scapy"],
            research_status: "Demonstrated",
          },
          {
            name: "BSS Color Change Spoofing",
            description: "Send forged BSS Color Change Announcement frames to cause clients to update their color filters.",
            difficulty: "MEDIUM",
            tools: ["Scapy"],
            research_status: "Theoretical, PMF mitigates",
          },
        ],
      },
      {
        category: "MLO - Multi-Link Operation (WiFi 7)",
        description: "WiFi 7's flagship feature: simultaneous connections across multiple bands with single association.",
        new_attack_vectors: [
          {
            name: "Cross-Link Traffic Correlation",
            description: "Monitor multiple bands simultaneously to correlate traffic across MLO links. Can reveal traffic patterns even if encrypted.",
            difficulty: "HIGH",
            tools: ["Multiple WiFi adapters", "Custom correlation software"],
            research_status: "Theoretical, emerging research",
          },
          {
            name: "MLO Setup Manipulation",
            description: "Inject or modify Multi-Link Setup frames during association to manipulate link parameters.",
            difficulty: "HIGH",
            tools: ["Not yet available publicly"],
            research_status: "Theoretical",
          },
          {
            name: "Link Preference Manipulation",
            description: "Force target to prefer a specific link (e.g., 2.4GHz) where attacker has better positioning or capabilities.",
            difficulty: "MEDIUM",
            tools: ["Targeted interference on unwanted bands"],
            research_status: "Theoretical",
          },
          {
            name: "TID-to-Link Hijacking",
            description: "Manipulate Traffic Identifier to Link mapping to redirect specific traffic types to attacker-favorable link.",
            difficulty: "HIGH",
            tools: ["Not yet available publicly"],
            research_status: "Theoretical",
          },
        ],
      },
      {
        category: "320MHz Channels (WiFi 7)",
        description: "WiFi 7 supports 320MHz wide channels in 6GHz band.",
        new_attack_vectors: [
          {
            name: "Wider Spectrum Monitoring",
            description: "320MHz channels concentrate more traffic in analyzable bandwidth. Easier to capture all traffic with single monitor.",
            difficulty: "LOW",
            tools: ["Standard WiFi 7 capable adapter in monitor mode"],
            research_status: "Practical",
          },
          {
            name: "Puncturing Pattern Analysis",
            description: "Preamble puncturing patterns reveal interference environment information.",
            difficulty: "MEDIUM",
            tools: ["WiFi 7 capable monitor"],
            research_status: "Theoretical",
          },
        ],
      },
      {
        category: "WiFi Sensing (WiFi 6/7)",
        description: "WiFi 6/7 enable sophisticated environment sensing via CSI analysis.",
        new_attack_vectors: [
          {
            name: "Passive Human Detection",
            description: "CSI analysis can detect human presence, movement, and even gestures through walls. Privacy implications for WiFi-enabled spaces.",
            difficulty: "MEDIUM",
            tools: ["nexmon CSI extractor", "PicoScenes", "Custom ML models"],
            research_status: "Extensively demonstrated in research",
          },
          {
            name: "Keystroke Detection via CSI",
            description: "Fine-grained CSI from WiFi 6 OFDMA can potentially detect keystrokes on nearby keyboards.",
            difficulty: "HIGH",
            tools: ["Custom ML pipeline"],
            research_status: "Academic proof-of-concept",
          },
        ],
      },
    ];

    // Relevant KB entries
    const wifi6Attack = WIFI_ATTACKS.find((a) => a.id === "wifi6_ofdma");
    const wifi7Attack = WIFI_ATTACKS.find((a) => a.id === "wifi7_mlo");
    const powerSaveCve = WIRELESS_CVES.find((c) => c.cveId === "CVE-2022-47522");

    return json({
      wifi67_attack_surface: {
        summary: "WiFi 6 and WiFi 7 introduce significant new attack surfaces primarily through OFDMA scheduling side-channels, TWT power-save manipulation, MLO cross-link correlation, and WiFi sensing privacy risks.",
        attack_surfaces: attackSurfaces,
        total_new_vectors: attackSurfaces.reduce((sum, cat) => sum + cat.new_attack_vectors.length, 0),
        by_difficulty: {
          low: attackSurfaces.flatMap((c) => c.new_attack_vectors.filter((v) => v.difficulty === "LOW")).length,
          medium: attackSurfaces.flatMap((c) => c.new_attack_vectors.filter((v) => v.difficulty === "MEDIUM")).length,
          high: attackSurfaces.flatMap((c) => c.new_attack_vectors.filter((v) => v.difficulty === "HIGH")).length,
        },
        mitigation_summary: [
          "Enable PMF (802.11w) on all bands to protect management frames",
          "Apply CVE-2022-47522 patches on all WiFi 6/7 devices",
          "Use WPA3-SAE on all bands (mandatory on 6GHz)",
          "Deploy WIDS capable of WiFi 6/7 frame analysis",
          "Use VPN for sensitive traffic (defense against side-channel analysis)",
          "Monitor for anomalous management frames targeting new features",
          "Keep firmware updated - security research on WiFi 6/7 is rapidly evolving",
          "Consider physical security - WiFi sensing can detect activity through walls",
        ],
        kb_references: [
          wifi6Attack ? { id: wifi6Attack.id, name: wifi6Attack.name, severity: wifi6Attack.severity } : null,
          wifi7Attack ? { id: wifi7Attack.id, name: wifi7Attack.name, severity: wifi7Attack.severity } : null,
          powerSaveCve ? { cve: powerSaveCve.cveId, name: powerSaveCve.name, severity: powerSaveCve.severity } : null,
        ].filter(Boolean),
      },
    });
  },
};

export const wifi67Tools: ToolDef[] = [
  wifi6_assess,
  wifi7_assess,
  wifi67_compare,
  wifi67_new_attack_surface,
];
