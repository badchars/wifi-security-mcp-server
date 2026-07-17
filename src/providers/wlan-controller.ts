import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Helpers ───

const CONTROLLER_TYPES = ["cisco_wlc", "aruba", "meraki", "unifi", "ruckus", "fortinet"] as const;

interface ConfigFinding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  remediation: string;
}

function analyzeConfig(controllerType: string, configData: string): ConfigFinding[] {
  const findings: ConfigFinding[] = [];
  const lower = configData.toLowerCase();

  // Universal checks
  if (lower.includes("wep") && !lower.includes("no wep") && !lower.includes("disable wep")) {
    findings.push({ severity: "critical", title: "WEP Encryption Detected", description: "WEP is cryptographically broken and can be cracked in minutes. Any network using WEP provides effectively no encryption.", remediation: "Migrate all WEP networks to WPA2-Enterprise or WPA3-SAE immediately." });
  }
  if (lower.includes("wpa ") && !lower.includes("wpa2") && !lower.includes("wpa3")) {
    findings.push({ severity: "high", title: "WPA (TKIP) Encryption Detected", description: "WPA with TKIP has known cryptographic weaknesses (Beck-Tews, Ohigashi-Morii attacks).", remediation: "Upgrade to WPA2 with AES/CCMP or WPA3-SAE." });
  }
  if (lower.includes("psk") && (lower.includes("wpa2") || lower.includes("wpa "))) {
    findings.push({ severity: "medium", title: "Pre-Shared Key (PSK) Authentication", description: "PSK mode shares a single key among all users. If one device is compromised, the entire network key is exposed. Offline dictionary attacks are possible against WPA2-PSK.", remediation: "Use WPA2-Enterprise with 802.1X/EAP and RADIUS authentication for corporate environments." });
  }
  if (lower.includes("open") && !lower.includes("open-none") && !lower.includes("closed")) {
    findings.push({ severity: "critical", title: "Open (Unencrypted) Network", description: "Open networks provide no encryption or authentication. All traffic is visible to passive eavesdroppers.", remediation: "Enable WPA3-SAE or WPA2-Enterprise. If guest access is needed, use OWE (Opportunistic Wireless Encryption)." });
  }
  if (lower.includes("telnet") && !lower.includes("no telnet") && !lower.includes("disable telnet")) {
    findings.push({ severity: "high", title: "Telnet Management Enabled", description: "Telnet transmits credentials and commands in cleartext. An attacker on the management VLAN can capture admin credentials.", remediation: "Disable Telnet and use SSH for CLI management." });
  }
  if (lower.includes("http") && !lower.includes("https") && !lower.includes("no http")) {
    findings.push({ severity: "high", title: "HTTP Management Enabled (No TLS)", description: "HTTP management interface transmits admin credentials in cleartext.", remediation: "Disable HTTP management and enforce HTTPS with a valid TLS certificate." });
  }
  if (lower.includes("snmp") && (lower.includes("public") || lower.includes("private"))) {
    findings.push({ severity: "high", title: "Default SNMP Community Strings", description: "Default SNMP community strings (public/private) allow unauthorized read/write access to controller configuration.", remediation: "Change SNMP community strings to complex values or migrate to SNMPv3 with authentication and encryption." });
  }
  if (lower.includes("snmpv1") || lower.includes("snmp v1") || (lower.includes("snmpv2") && !lower.includes("snmpv3"))) {
    findings.push({ severity: "medium", title: "SNMPv1/v2c in Use", description: "SNMPv1/v2c transmits community strings in cleartext and lacks authentication.", remediation: "Migrate to SNMPv3 with AuthPriv (authentication + encryption)." });
  }
  if (!lower.includes("802.11w") && !lower.includes("pmf") && !lower.includes("management frame protection")) {
    findings.push({ severity: "medium", title: "Protected Management Frames (PMF) Not Detected", description: "Without 802.11w/PMF, management frames are unprotected. Deauthentication and disassociation attacks are trivial.", remediation: "Enable 802.11w PMF (required mode for WPA3, optional for WPA2)." });
  }
  if (!lower.includes("radius") && !lower.includes("802.1x") && !lower.includes("eap")) {
    findings.push({ severity: "medium", title: "No RADIUS/802.1X Configuration Detected", description: "No enterprise authentication (802.1X/EAP) configuration found. PSK-only deployments lack per-user accountability.", remediation: "Implement 802.1X with RADIUS for enterprise networks. Use EAP-TLS for strongest security." });
  }
  if (lower.includes("wps") && !lower.includes("disable wps") && !lower.includes("no wps")) {
    findings.push({ severity: "high", title: "WPS (WiFi Protected Setup) Enabled", description: "WPS is vulnerable to brute force (Reaver) and Pixie Dust attacks. An attacker can recover the WPA2 PSK via WPS PIN.", remediation: "Disable WPS on all access points." });
  }
  if (lower.includes("default") && (lower.includes("password") || lower.includes("admin"))) {
    findings.push({ severity: "critical", title: "Potential Default Credentials", description: "Configuration references default credentials. Default admin passwords are publicly documented for all vendors.", remediation: "Change all default passwords immediately. Use strong, unique passwords for admin accounts." });
  }

  // Vendor-specific checks
  if (controllerType === "cisco_wlc") {
    if (lower.includes("aaa") && !lower.includes("aaa authentication")) {
      findings.push({ severity: "medium", title: "Cisco WLC: Incomplete AAA Configuration", description: "AAA section present but authentication configuration may be incomplete.", remediation: "Configure 'aaa authentication login default local' and RADIUS server groups." });
    }
    if (lower.includes("management") && !lower.includes("management via-wireless disable")) {
      findings.push({ severity: "medium", title: "Cisco WLC: Wireless Management Access", description: "Management access via wireless interface may be enabled, allowing controller management from wireless clients.", remediation: "Disable wireless management: 'config network mgmt-via-wireless disable'." });
    }
  }

  if (controllerType === "aruba") {
    if (!lower.includes("ids") && !lower.includes("wids") && !lower.includes("intrusion")) {
      findings.push({ severity: "medium", title: "Aruba: WIDS/WIPS Not Detected", description: "No wireless intrusion detection configuration found. Aruba supports built-in WIDS/WIPS.", remediation: "Enable Aruba WIDS/WIPS profiles for rogue AP detection and containment." });
    }
  }

  if (controllerType === "unifi") {
    if (lower.includes("guest") && !lower.includes("guest isolation")) {
      findings.push({ severity: "medium", title: "UniFi: Guest Network Without Isolation", description: "Guest network detected but client isolation may not be enabled. Guests could communicate with each other.", remediation: "Enable guest isolation (L2 isolation) and restrict guest VLAN access." });
    }
  }

  if (findings.length === 0) {
    findings.push({ severity: "info", title: "No Obvious Issues Detected", description: "Static analysis did not find common misconfigurations. This does not guarantee security.", remediation: "Perform active wireless penetration testing and review full controller configuration manually." });
  }

  return findings;
}

// ─── Tool 1: wlan_audit_config ───

const wlan_audit_config: ToolDef = {
  name: "wlan_audit_config",
  description: "Audit WLAN controller configuration for security misconfigurations. Analyzes raw controller config text for weak encryption, default credentials, insecure management protocols, missing PMF, and vendor-specific issues.",
  schema: {
    controller_type: z.enum(CONTROLLER_TYPES).describe("WLAN controller vendor/platform type"),
    config_data: z.string().describe("Raw WLAN controller configuration text to analyze"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const controllerType = args.controller_type as string;
    const configData = args.config_data as string;

    const findings = analyzeConfig(controllerType, configData);

    const criticalCount = findings.filter((f) => f.severity === "critical").length;
    const highCount = findings.filter((f) => f.severity === "high").length;
    const mediumCount = findings.filter((f) => f.severity === "medium").length;

    let overallRisk = "LOW";
    if (criticalCount > 0) overallRisk = "CRITICAL";
    else if (highCount > 0) overallRisk = "HIGH";
    else if (mediumCount > 0) overallRisk = "MEDIUM";

    return json({
      audit_result: {
        controller_type: controllerType,
        overall_risk: overallRisk,
        finding_counts: { critical: criticalCount, high: highCount, medium: mediumCount, low: findings.filter((f) => f.severity === "low").length, info: findings.filter((f) => f.severity === "info").length },
        findings,
        next_steps: [
          "Remediate critical and high findings immediately",
          "Perform active wireless penetration test to validate findings",
          "Review RADIUS/AAA server configuration separately",
          "Verify firmware is up-to-date for known CVE patches",
          "Test rogue AP detection with intentional rogue deployment",
        ],
      },
    });
  },
};

// ─── Tool 2: wlan_check_rogue_ap ───

const wlan_check_rogue_ap: ToolDef = {
  name: "wlan_check_rogue_ap",
  description: "Rogue AP detection guidance for WLAN controllers. Provides detection methodology, WIDS/WIPS configuration steps, and response procedures based on controller vendor.",
  schema: {
    controller_type: z.enum(CONTROLLER_TYPES).describe("WLAN controller vendor/platform type"),
    wids_enabled: z.boolean().optional().describe("Whether WIDS/WIPS is currently enabled on the controller"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const controllerType = args.controller_type as string;
    const widsEnabled = args.wids_enabled as boolean | undefined;

    const vendorGuides: Record<string, { detection_setup: string[]; containment: string[]; monitoring: string[] }> = {
      cisco_wlc: {
        detection_setup: [
          "Enable rogue AP detection: config rogue ap rldp enable",
          "Configure rogue detection interval: config rogue ap timeout 1200",
          "Set rogue AP classification rules: config rogue rule add priority 1 classify malicious ssid <corp_ssid>",
          "Enable rogue on wire detection: config rogue ap rldp enable",
          "Configure notification: config rogue ap alert-timeout 300",
        ],
        containment: [
          "Auto-contain malicious rogues: config rogue ap rldp auto-contain enable",
          "Manual containment: config rogue ap contain <rogue_mac> <containing_ap_count>",
          "WARNING: Auto-containment may have legal implications — deauthing unknown APs",
        ],
        monitoring: [
          "show rogue ap summary",
          "show rogue ap detailed <mac>",
          "show rogue ap clients <mac>",
          "Monitor via Prime Infrastructure or DNA Center for centralized rogue management",
        ],
      },
      aruba: {
        detection_setup: [
          "Enable WIDS: wlan wids-profile <name>",
          "Set detection sensitivity: rogue-ap-detection enable",
          "Configure infrastructure detection: infrastructure-detection enable",
          "Set classification policy: rogue-ap-classification enable",
          "Enable AP monitoring: am-scan-profile default",
        ],
        containment: [
          "Enable wireless containment: containment deauth-only (safest option)",
          "Enable wired containment: wired-containment enable (ARP-based)",
          "Configure auto-containment rules in AirWave or Central",
        ],
        monitoring: [
          "show wids rogue-ap-list",
          "show wids rogue-ap-detail <mac>",
          "Aruba AirWave or Central for centralized WIDS dashboards",
        ],
      },
      meraki: {
        detection_setup: [
          "Navigate to Wireless > Air Marshal in Meraki Dashboard",
          "Air Marshal provides automatic rogue AP detection",
          "Configure alert rules for specific SSID matches",
          "Enable 'Contains the same SSID as the Meraki network' rule",
        ],
        containment: [
          "Air Marshal supports auto-containment of rogues matching your SSID",
          "Enable containment per SSID under Wireless > Air Marshal > Rules",
          "Set containment strength (number of frames per second)",
        ],
        monitoring: [
          "Dashboard: Wireless > Air Marshal for real-time rogue list",
          "API: GET /networks/{id}/wireless/airMarshal",
          "Configure email/webhook alerts for new rogue detections",
        ],
      },
      unifi: {
        detection_setup: [
          "UniFi does not have built-in WIDS/WIPS",
          "Use external tools: Kismet, OpenWIPS-ng, or commercial WIDS",
          "Enable 'Rogue AP' alerts in UniFi Network settings (basic detection only)",
          "Deploy dedicated scanning APs for continuous monitoring",
        ],
        containment: [
          "UniFi does NOT support wireless containment natively",
          "Use Kismet or external WIDS for containment capabilities",
          "Wired-side: use 802.1X port authentication to prevent rogue AP on wired network",
        ],
        monitoring: [
          "UniFi Controller > Insights > Neighboring APs",
          "Third-party: Kismet for continuous monitoring",
          "Script periodic scans with UniFi API and alert on new BSSIDs",
        ],
      },
      ruckus: {
        detection_setup: [
          "Enable rogue AP detection: set rogue detect enable",
          "Configure WIDS: set wids enable",
          "Set detection parameters: set rogue detect interval 60",
          "Configure rogue classification rules based on SSID, signal, and encryption",
        ],
        containment: [
          "Enable auto-containment: set rogue auto-contain enable",
          "Manual contain: rogue contain <mac>",
          "Configure containment policy per classification",
        ],
        monitoring: [
          "show rogue summary",
          "show rogue detail <mac>",
          "SmartZone dashboard for centralized rogue management",
        ],
      },
      fortinet: {
        detection_setup: [
          "Enable WIDS: config wireless-controller wids-profile",
          "Enable rogue AP detection: set ap-scan enable",
          "Configure background scan: set ap-bgscan-period 60",
          "Set rogue AP classification thresholds",
        ],
        containment: [
          "Enable rogue AP suppression: set rogue-scan suppress enable",
          "FortiAP can send deauth frames to rogue AP clients",
          "WARNING: Verify legal compliance before enabling auto-containment",
        ],
        monitoring: [
          "diagnose wireless-controller wlac -d rogue",
          "FortiManager for centralized WIDS reporting",
          "Configure FortiAnalyzer log forwarding for rogue events",
        ],
      },
    };

    const guide = vendorGuides[controllerType] || vendorGuides.cisco_wlc;

    return json({
      rogue_ap_detection: {
        controller_type: controllerType,
        wids_currently_enabled: widsEnabled ?? "unknown",
        detection_methodology: [
          "1. Passive scanning: APs scan channels during off-time for rogue signals",
          "2. Active probing: Controller sends probe requests to detect rogues",
          "3. Wired-side detection: ARP/RLDP to determine if rogue is on corporate network",
          "4. SSID matching: Flag any non-authorized AP broadcasting your corporate SSID",
          "5. Signal strength analysis: Strong unknown signals near facilities are suspicious",
        ],
        vendor_specific_setup: guide.detection_setup,
        containment_options: guide.containment,
        monitoring_commands: guide.monitoring,
        manual_detection_tools: [
          "Kismet (passive wireless monitoring)",
          "airodump-ng (802.11 frame capture)",
          "WiFi Explorer Pro (macOS)",
          "inSSIDer (Windows)",
          "Ekahau Survey (enterprise)",
        ],
        legal_warning: "Wireless containment (deauthentication of rogue APs) may violate local telecommunications regulations. Consult legal counsel before enabling auto-containment in production.",
        recommendations: widsEnabled === false
          ? ["CRITICAL: Enable WIDS/WIPS immediately", "PCI DSS requires quarterly wireless scans (Req 11.2.1)", "Deploy at minimum passive rogue detection"]
          : ["Validate WIDS detection with intentional rogue AP test", "Review rogue classification rules quarterly", "Ensure all facility areas have monitoring coverage"],
      },
    });
  },
};

// ─── Tool 3: wlan_audit_ssid ───

const wlan_audit_ssid: ToolDef = {
  name: "wlan_audit_ssid",
  description: "Audit SSID configuration for security issues. Analyzes SSID settings including encryption, VLAN assignment, RADIUS configuration, client isolation, and band steering.",
  schema: {
    ssid_config: z.string().describe("SSID configuration as JSON string with fields: ssid, encryption, vlan, radius, hidden, client_isolation, band_steering, max_clients, etc."),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const rawConfig = args.ssid_config as string;

    let config: Record<string, unknown>;
    try {
      config = JSON.parse(rawConfig);
    } catch {
      return text("Error: ssid_config must be valid JSON. Example: {\"ssid\":\"CorpNet\",\"encryption\":\"WPA2\",\"vlan\":10,\"radius\":true}");
    }

    const ssid = (config.ssid as string) || "unknown";
    const encryption = ((config.encryption as string) || "unknown").toUpperCase();
    const vlan = config.vlan as number | undefined;
    const radius = config.radius as boolean | undefined;
    const hidden = config.hidden as boolean | undefined;
    const clientIsolation = config.client_isolation as boolean | undefined;
    const bandSteering = config.band_steering as boolean | undefined;
    const maxClients = config.max_clients as number | undefined;

    const findings: ConfigFinding[] = [];
    let score = 100;

    // Encryption assessment
    if (encryption === "OPEN" || encryption === "NONE") {
      findings.push({ severity: "critical", title: "No Encryption", description: `SSID '${ssid}' has no encryption. All traffic is in cleartext.`, remediation: "Enable WPA3-SAE or WPA2-Enterprise. For guest networks, use OWE." });
      score -= 40;
    } else if (encryption === "WEP") {
      findings.push({ severity: "critical", title: "WEP Encryption", description: `SSID '${ssid}' uses WEP which is cryptographically broken.`, remediation: "Upgrade to WPA2 or WPA3 immediately." });
      score -= 35;
    } else if (encryption === "WPA" || encryption === "TKIP") {
      findings.push({ severity: "high", title: "WPA/TKIP Encryption", description: `SSID '${ssid}' uses WPA/TKIP which has known weaknesses.`, remediation: "Upgrade to WPA2 with AES/CCMP or WPA3-SAE." });
      score -= 20;
    } else if (encryption.includes("WPA2")) {
      if (!radius) {
        findings.push({ severity: "medium", title: "WPA2-PSK Mode", description: "WPA2-PSK shares one key among all users. Offline dictionary attacks possible.", remediation: "Use WPA2-Enterprise with RADIUS for corporate networks." });
        score -= 10;
      }
    }

    // VLAN checks
    if (vlan === undefined || vlan === 0 || vlan === 1) {
      findings.push({ severity: "high", title: "Default/No VLAN Segmentation", description: `SSID '${ssid}' is on default VLAN (${vlan ?? "none"}). Wireless clients may have direct access to management and server networks.`, remediation: "Assign a dedicated VLAN for this SSID and implement inter-VLAN ACLs." });
      score -= 15;
    }

    // RADIUS
    if (radius === false && !encryption.includes("OPEN")) {
      findings.push({ severity: "medium", title: "No RADIUS Authentication", description: "No 802.1X/RADIUS authentication configured. Per-user accountability is absent.", remediation: "Implement 802.1X with RADIUS and EAP-TLS or PEAP-MSCHAPv2." });
      score -= 10;
    }

    // Hidden SSID
    if (hidden === true) {
      findings.push({ severity: "low", title: "Hidden SSID (Security Through Obscurity)", description: "Hidden SSID provides no real security. Clients broadcast the SSID in probe requests, making it easily discoverable.", remediation: "Hidden SSID is not a security measure. Focus on strong encryption and authentication instead." });
    }

    // Client isolation
    if (clientIsolation === false) {
      const isGuest = ssid.toLowerCase().includes("guest") || ssid.toLowerCase().includes("visitor");
      findings.push({
        severity: isGuest ? "high" : "medium",
        title: "Client Isolation Disabled",
        description: `Clients on SSID '${ssid}' can communicate with each other directly. ${isGuest ? "This is especially dangerous on guest networks." : ""}`,
        remediation: "Enable client isolation (AP isolation / L2 isolation) to prevent client-to-client attacks.",
      });
      score -= isGuest ? 15 : 5;
    }

    // Max clients
    if (maxClients === undefined) {
      findings.push({ severity: "low", title: "No Client Limit", description: "No maximum client limit configured. The network is susceptible to resource exhaustion.", remediation: "Set a reasonable max client limit per SSID to prevent DoS." });
    }

    const overallRisk = score >= 80 ? "LOW" : score >= 60 ? "MEDIUM" : score >= 40 ? "HIGH" : "CRITICAL";

    return json({
      ssid_assessment: {
        ssid,
        encryption,
        vlan: vlan ?? "not set",
        radius_auth: radius ?? false,
        hidden: hidden ?? false,
        client_isolation: clientIsolation ?? "unknown",
        band_steering: bandSteering ?? "unknown",
        max_clients: maxClients ?? "unlimited",
        overall_risk: overallRisk,
        security_score: Math.max(0, score),
        findings,
      },
    });
  },
};

// ─── Tool 4: wlan_hardening ───

const wlan_hardening: ToolDef = {
  name: "wlan_hardening",
  description: "Generate vendor-specific WLAN controller hardening guide. Returns comprehensive hardening checklist covering management access, encryption, authentication, monitoring, and firmware management.",
  schema: {
    controller_type: z.enum(CONTROLLER_TYPES).describe("WLAN controller vendor/platform type"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const controllerType = args.controller_type as string;

    const commonHardening = {
      management_access: [
        "Disable Telnet — use SSH (v2) only for CLI management",
        "Disable HTTP — use HTTPS with valid TLS certificate",
        "Restrict management access to dedicated management VLAN",
        "Disable wireless management access (manage controller only from wired network)",
        "Implement RBAC with least-privilege admin roles",
        "Enable login banners with legal warning text",
        "Configure session timeout (max 15 minutes idle)",
        "Enable MFA for admin access where supported",
      ],
      snmp: [
        "Disable SNMPv1 and SNMPv2c",
        "Use SNMPv3 with AuthPriv (SHA-256 + AES-256)",
        "Change all default community strings",
        "Restrict SNMP access to NMS IP addresses only",
      ],
      wireless_security: [
        "Use WPA3-SAE for personal networks, WPA3-Enterprise for corporate",
        "Minimum: WPA2-Enterprise with AES/CCMP (no TKIP)",
        "Enable 802.11w Protected Management Frames (PMF)",
        "Disable WPS on all APs",
        "Implement 802.1X with RADIUS for enterprise SSIDs",
        "Use EAP-TLS (mutual certificate auth) or PEAP-MSCHAPv2 minimum",
        "Enable client isolation on guest/visitor SSIDs",
        "Assign dedicated VLANs per SSID with inter-VLAN ACLs",
      ],
      rogue_detection: [
        "Enable WIDS/WIPS on all APs",
        "Configure rogue AP classification rules (match on SSID, signal, encryption)",
        "Test detection with intentional rogue AP quarterly",
        "Forward WIDS events to SIEM",
        "Document incident response procedure for rogue AP discovery",
      ],
      firmware: [
        "Subscribe to vendor security advisories",
        "Test firmware updates in lab before production deployment",
        "Maintain firmware update schedule (quarterly minimum)",
        "Document all firmware versions across the fleet",
        "Enable automatic vulnerability scanning of AP firmware",
      ],
      logging: [
        "Enable authentication event logging",
        "Forward logs to centralized SIEM",
        "Log management access (SSH, HTTPS, API)",
        "Enable wireless client association/disassociation logging",
        "Retain logs per compliance requirements (PCI DSS: 1 year)",
      ],
    };

    const vendorSpecific: Record<string, string[]> = {
      cisco_wlc: [
        "config network mgmt-via-wireless disable",
        "config network secureweb enable",
        "config network ssh enable",
        "config network telnet disable",
        "config wlan security wpa akm ft enable (if using 802.11r)",
        "config advanced eap bcast-key-interval 3600",
        "config switchconfig strong-pwd case-check enable",
        "config switchconfig strong-pwd consecutive-check enable",
        "config switchconfig strong-pwd min-length 8",
        "Upgrade to IOS-XE based Catalyst 9800 for latest security features",
      ],
      aruba: [
        "ip access-list session management — restrict management IPs",
        "aaa authentication mgmt default local",
        "crypto pki ta-profile — configure RADIUS server certificate validation",
        "wlan ssid-profile — set opmode wpa3-aes-ccm-256 for WPA3",
        "ap-group — assign APs to role-specific groups",
        "arm — enable Adaptive Radio Management for interference mitigation",
        "Configure ClearPass for 802.1X and profiling",
      ],
      meraki: [
        "Dashboard > Organization > Configure > Login Security — enforce 2FA",
        "Configure API key rotation schedule",
        "Enable SAML SSO for dashboard access",
        "Use Dashboard API for automated compliance checks",
        "Enable Adaptive Policy for micro-segmentation",
        "Configure Group Policies per SSID for traffic shaping and ACLs",
      ],
      unifi: [
        "Enable 2FA on UniFi controller login",
        "Use UniFi Cloud Key or self-hosted controller behind VPN",
        "Disable cloud access to controller if not needed",
        "Configure RADIUS profiles under Settings > Profiles",
        "Enable DPI (Deep Packet Inspection) for traffic visibility",
        "Set minimum RSSI for client connection quality",
        "Consider third-party WIDS (Kismet) since UniFi lacks native WIDS",
      ],
      ruckus: [
        "Configure admin password complexity in SmartZone",
        "Enable AP certificate-based authentication",
        "Configure DPD (Dead Peer Detection) for mesh APs",
        "Enable ChannelFly for dynamic channel management",
        "Configure AP firmware auto-upgrade schedule",
        "Enable WIPS profile with auto-containment rules",
      ],
      fortinet: [
        "config wireless-controller wtp-profile — set AP profiles",
        "config wireless-controller wids-profile — enable WIDS",
        "set admin-https-ssl-versions tlsv1-2 tlsv1-3",
        "config system admin — set two-factor fortitoken",
        "config wireless-controller global — set rogue-scan enable",
        "Integrate with FortiNAC for device profiling and 802.1X",
        "Enable FortiAnalyzer logging for wireless events",
      ],
    };

    return json({
      hardening_guide: {
        controller_type: controllerType,
        common_hardening: commonHardening,
        vendor_specific_steps: vendorSpecific[controllerType] || [],
        compliance_mapping: {
          pci_dss: ["Req 1.2.3 (Wireless segmentation)", "Req 2.3.2 (Vendor defaults)", "Req 4.2.1 (Strong crypto)", "Req 11.2.1 (Quarterly scanning)"],
          nist_800_153: ["Sec 3.1 (WLAN policy)", "Sec 4.1 (WPA2/WPA3 Enterprise)", "Sec 4.3 (Rogue monitoring)"],
          hipaa: ["164.312(a)(1) (Access control)", "164.312(e)(1) (Transmission security)"],
        },
        priority_order: [
          "1. Change all default credentials",
          "2. Disable insecure management protocols (Telnet, HTTP)",
          "3. Enforce WPA2-Enterprise or WPA3 encryption",
          "4. Enable 802.11w PMF",
          "5. Disable WPS",
          "6. Segment wireless to dedicated VLANs",
          "7. Enable WIDS/WIPS",
          "8. Configure centralized logging to SIEM",
          "9. Update firmware to latest stable version",
          "10. Document and test incident response procedures",
        ],
      },
    });
  },
};

// ─── Export ───

export const wlanControllerTools: ToolDef[] = [
  wlan_audit_config,
  wlan_check_rogue_ap,
  wlan_audit_ssid,
  wlan_hardening,
];
