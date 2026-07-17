import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { PENTEST_HARDWARE } from "../knowledge/index.js";
import type { PentestHardware } from "../knowledge/index.js";

// ─── Constants ───

const CATEGORIES = ["wifi", "bluetooth", "sdr", "nfc_rfid", "cellular", "iot", "multi"] as const;

const USE_CASES = ["wifi_pentest", "bt_pentest", "rfid_clone", "rf_replay", "cellular_test", "iot_test", "full_kit"] as const;

// ─── Tool 1: hw_lookup ───

const hw_lookup: ToolDef = {
  name: "hw_lookup",
  description: "Look up pentest hardware device by its ID. Returns full details including capabilities, frequencies, protocols, interfaces, price range, and recommended use cases.",
  schema: {
    hardware_id: z.string().describe("Hardware device ID (e.g., 'flipper_zero', 'hackrf_one', 'proxmark3', 'wifi_pineapple')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const hwId = (args.hardware_id as string).toLowerCase().replace(/[\s-]/g, "_");

    const device = PENTEST_HARDWARE.find(
      (h) => h.id === hwId || h.name.toLowerCase().replace(/[\s-]/g, "_") === hwId
    );

    if (!device) {
      // Partial match
      const partials = PENTEST_HARDWARE.filter(
        (h) => h.id.includes(hwId) || h.name.toLowerCase().includes(hwId.replace(/_/g, " "))
      );

      if (partials.length > 0) {
        return json({
          exact_match: null,
          suggestions: partials.map((h) => ({ id: h.id, name: h.name, category: h.category })),
          message: `No exact match for '${hwId}'. Did you mean one of these?`,
        });
      }

      return json({
        exact_match: null,
        message: `Hardware '${hwId}' not found in database.`,
        available_devices: PENTEST_HARDWARE.map((h) => ({ id: h.id, name: h.name, category: h.category })),
      });
    }

    return json({
      hardware_details: {
        id: device.id,
        name: device.name,
        category: device.category,
        manufacturer: device.manufacturer,
        price_range: device.priceRange,
        capabilities: device.capabilities,
        frequencies: device.frequencies,
        supported_protocols: device.protocols,
        interfaces: device.interfaces,
        open_source: device.openSource,
        firmware_url: device.firmwareUrl ?? "N/A (closed source)",
        purchase_url: device.purchaseUrl ?? "Search manufacturer website",
        description: device.description,
        recommended_use_cases: device.useCases,
        complementary_tools: PENTEST_HARDWARE.filter(
          (h) => h.id !== device.id && (
            h.category === device.category ||
            device.capabilities.some((cap) =>
              h.capabilities.some((hCap) => hCap.toLowerCase().includes(cap.split(" ")[0].toLowerCase()))
            )
          )
        ).slice(0, 3).map((h) => ({ id: h.id, name: h.name, category: h.category })),
      },
    });
  },
};

// ─── Tool 2: hw_search ───

const hw_search: ToolDef = {
  name: "hw_search",
  description: "Search pentest hardware by category, maximum price, and/or capability keyword. Returns filtered list of devices matching the specified criteria.",
  schema: {
    category: z.enum(CATEGORIES).optional().describe("Hardware category filter"),
    max_price: z.number().optional().describe("Maximum price in USD"),
    capability: z.string().optional().describe("Capability keyword to search for (e.g., 'monitor mode', 'NFC', 'TX/RX', 'BLE sniffing')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const category = args.category as string | undefined;
    const maxPrice = args.max_price as number | undefined;
    const capability = args.capability as string | undefined;

    let filtered = [...PENTEST_HARDWARE];

    if (category) {
      filtered = filtered.filter((h) => h.category === category);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((h) => {
        // Parse price from string like "$169", "$300-400", "$60"
        const priceMatch = h.priceRange.match(/\$(\d+)/);
        if (!priceMatch) return true;
        const basePrice = parseInt(priceMatch[1]);
        return basePrice <= maxPrice;
      });
    }

    if (capability) {
      const capLower = capability.toLowerCase();
      filtered = filtered.filter((h) =>
        h.capabilities.some((c) => c.toLowerCase().includes(capLower)) ||
        h.protocols.some((p) => p.toLowerCase().includes(capLower)) ||
        h.description.toLowerCase().includes(capLower) ||
        h.useCases.some((u) => u.toLowerCase().includes(capLower))
      );
    }

    return json({
      search_results: {
        filters: {
          category: category ?? "all",
          max_price: maxPrice ? `$${maxPrice}` : "no limit",
          capability: capability ?? "any",
        },
        total_matches: filtered.length,
        devices: filtered.map((h) => ({
          id: h.id,
          name: h.name,
          category: h.category,
          price: h.priceRange,
          capabilities: h.capabilities,
          protocols: h.protocols,
          open_source: h.openSource,
          description: h.description,
        })),
      },
    });
  },
};

// ─── Tool 3: hw_recommend ───

const hw_recommend: ToolDef = {
  name: "hw_recommend",
  description: "Recommend pentest hardware for a specific use case. Returns ranked recommendations with justification, including budget-appropriate options and complementary device suggestions.",
  schema: {
    use_case: z.enum(USE_CASES).describe("Intended use case for hardware recommendation"),
    budget: z.number().optional().describe("Maximum budget in USD for the recommendation"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const useCase = args.use_case as string;
    const budget = args.budget as number | undefined;

    interface Recommendation {
      priority: "essential" | "recommended" | "optional";
      device: PentestHardware;
      justification: string;
    }

    const useCaseMap: Record<string, { description: string; categories: string[]; keywords: string[]; essentialCapabilities: string[] }> = {
      wifi_pentest: {
        description: "WiFi penetration testing — handshake capture, Evil Twin, deauth, WPS attacks",
        categories: ["wifi"],
        keywords: ["monitor mode", "packet injection", "rogue ap", "evil twin", "handshake"],
        essentialCapabilities: ["Monitor mode", "Packet injection"],
      },
      bt_pentest: {
        description: "Bluetooth penetration testing — BLE sniffing, BR/EDR monitoring, GATT analysis",
        categories: ["bluetooth"],
        keywords: ["bluetooth", "ble", "br/edr", "sniffing"],
        essentialCapabilities: ["Bluetooth", "BLE"],
      },
      rfid_clone: {
        description: "RFID/NFC cloning — access card cloning, Mifare attacks, NFC fuzzing",
        categories: ["nfc_rfid"],
        keywords: ["rfid", "nfc", "mifare", "hid", "clone", "emulation"],
        essentialCapabilities: ["RFID", "NFC", "clone"],
      },
      rf_replay: {
        description: "RF signal replay — Sub-GHz capture/replay, garage doors, car key fobs, ISM band",
        categories: ["sdr"],
        keywords: ["sub-ghz", "replay", "tx/rx", "ook", "fsk"],
        essentialCapabilities: ["TX/RX", "Sub-GHz"],
      },
      cellular_test: {
        description: "Cellular security testing — GSM/LTE base station, IMSI catcher detection, protocol analysis",
        categories: ["sdr", "cellular"],
        keywords: ["cellular", "gsm", "lte", "full duplex", "base station"],
        essentialCapabilities: ["Full duplex", "LTE", "GSM"],
      },
      iot_test: {
        description: "IoT device testing — Zigbee, Z-Wave, BLE, nRF24, LoRa protocol analysis",
        categories: ["iot", "bluetooth"],
        keywords: ["zigbee", "z-wave", "nrf24", "mousejack", "ble", "iot"],
        essentialCapabilities: ["802.15.4", "Zigbee", "nRF24"],
      },
      full_kit: {
        description: "Complete wireless penetration testing toolkit — all domains covered",
        categories: ["wifi", "bluetooth", "sdr", "nfc_rfid", "iot", "multi"],
        keywords: [],
        essentialCapabilities: [],
      },
    };

    const useCaseInfo = useCaseMap[useCase];

    // Score and rank devices
    const scored = PENTEST_HARDWARE.map((device) => {
      let score = 0;

      // Category match
      if (useCaseInfo.categories.includes(device.category) || device.category === "multi") {
        score += 30;
      }

      // Keyword matches
      const allText = [...device.capabilities, ...device.protocols, ...device.useCases, device.description]
        .join(" ").toLowerCase();

      for (const kw of useCaseInfo.keywords) {
        if (allText.includes(kw.toLowerCase())) score += 10;
      }

      // Essential capability match
      for (const cap of useCaseInfo.essentialCapabilities) {
        if (allText.includes(cap.toLowerCase())) score += 20;
      }

      // Open source bonus
      if (device.openSource) score += 5;

      return { device, score };
    }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

    // Apply budget filter
    let recommendations: Recommendation[] = scored.map((s, index) => {
      const priceMatch = s.device.priceRange.match(/\$(\d+)/);
      const price = priceMatch ? parseInt(priceMatch[1]) : 0;

      let priority: "essential" | "recommended" | "optional";
      if (index === 0) priority = "essential";
      else if (index <= 2) priority = "recommended";
      else priority = "optional";

      if (budget !== undefined && price > budget) {
        priority = "optional";
      }

      return {
        priority,
        device: s.device,
        justification: `${s.device.name} (${s.device.priceRange}) — ${s.device.useCases.filter((u) => useCaseInfo.keywords.some((kw) => u.toLowerCase().includes(kw.toLowerCase()))).join(", ") || s.device.useCases[0]}`,
      };
    });

    // Calculate total cost
    const essentialDevices = recommendations.filter((r) => r.priority === "essential" || r.priority === "recommended");
    const totalCost = essentialDevices.reduce((sum, r) => {
      const match = r.device.priceRange.match(/\$(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    return json({
      hardware_recommendation: {
        use_case: useCase,
        description: useCaseInfo.description,
        budget: budget ? `$${budget}` : "no limit",
        estimated_cost: `$${totalCost} (essential + recommended)`,
        recommendations: recommendations.map((r) => ({
          priority: r.priority,
          id: r.device.id,
          name: r.device.name,
          price: r.device.priceRange,
          category: r.device.category,
          justification: r.justification,
          key_capabilities: r.device.capabilities.slice(0, 4),
          open_source: r.device.openSource,
        })),
        additional_software: useCase === "wifi_pentest"
          ? ["aircrack-ng", "hashcat", "hostapd-mana", "eaphammer", "wifiphisher", "bettercap"]
          : useCase === "bt_pentest"
            ? ["Wireshark (BLE plugin)", "btlejack", "GATTacker", "Bettercap BLE"]
            : useCase === "rfid_clone"
              ? ["Proxmark3 client", "libnfc", "mfoc", "mfcuk"]
              : useCase === "rf_replay"
                ? ["GNU Radio", "rfcat", "Universal Radio Hacker", "inspectrum"]
                : ["Various — depends on target protocol"],
      },
    });
  },
};

// ─── Tool 4: hw_compare ───

const hw_compare: ToolDef = {
  name: "hw_compare",
  description: "Compare two pentest hardware devices side by side. Returns a detailed comparison table covering capabilities, frequencies, protocols, price, and recommended use cases.",
  schema: {
    device_a: z.string().describe("First device ID to compare (e.g., 'hackrf_one')"),
    device_b: z.string().describe("Second device ID to compare (e.g., 'limesdr')"),
  },
  async execute(args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolResult> {
    const idA = (args.device_a as string).toLowerCase().replace(/[\s-]/g, "_");
    const idB = (args.device_b as string).toLowerCase().replace(/[\s-]/g, "_");

    const deviceA = PENTEST_HARDWARE.find(
      (h) => h.id === idA || h.name.toLowerCase().replace(/[\s-]/g, "_") === idA
    );
    const deviceB = PENTEST_HARDWARE.find(
      (h) => h.id === idB || h.name.toLowerCase().replace(/[\s-]/g, "_") === idB
    );

    if (!deviceA || !deviceB) {
      const missing = [];
      if (!deviceA) missing.push(idA);
      if (!deviceB) missing.push(idB);
      return json({
        error: `Device(s) not found: ${missing.join(", ")}`,
        available_devices: PENTEST_HARDWARE.map((h) => ({ id: h.id, name: h.name })),
      });
    }

    // Calculate comparison metrics
    const priceA = parseInt(deviceA.priceRange.match(/\$(\d+)/)?.[1] || "0");
    const priceB = parseInt(deviceB.priceRange.match(/\$(\d+)/)?.[1] || "0");

    const sharedProtocols = deviceA.protocols.filter((p) =>
      deviceB.protocols.some((bp) => bp.toLowerCase() === p.toLowerCase())
    );
    const uniqueA = deviceA.protocols.filter((p) =>
      !deviceB.protocols.some((bp) => bp.toLowerCase() === p.toLowerCase())
    );
    const uniqueB = deviceB.protocols.filter((p) =>
      !deviceA.protocols.some((ap) => ap.toLowerCase() === p.toLowerCase())
    );

    const sharedUseCases = deviceA.useCases.filter((u) =>
      deviceB.useCases.some((bu) => bu.toLowerCase().includes(u.toLowerCase().split(" ")[0]))
    );

    return json({
      hardware_comparison: {
        device_a: {
          id: deviceA.id,
          name: deviceA.name,
          category: deviceA.category,
          manufacturer: deviceA.manufacturer,
          price: deviceA.priceRange,
          capabilities: deviceA.capabilities,
          frequencies: deviceA.frequencies,
          protocols: deviceA.protocols,
          interfaces: deviceA.interfaces,
          open_source: deviceA.openSource,
          use_cases: deviceA.useCases,
        },
        device_b: {
          id: deviceB.id,
          name: deviceB.name,
          category: deviceB.category,
          manufacturer: deviceB.manufacturer,
          price: deviceB.priceRange,
          capabilities: deviceB.capabilities,
          frequencies: deviceB.frequencies,
          protocols: deviceB.protocols,
          interfaces: deviceB.interfaces,
          open_source: deviceB.openSource,
          use_cases: deviceB.useCases,
        },
        comparison: {
          price_difference: priceA !== priceB ? `${deviceA.name} is ${priceA < priceB ? "cheaper" : "more expensive"} ($${Math.abs(priceA - priceB)} difference)` : "Same price range",
          shared_protocols: sharedProtocols.length > 0 ? sharedProtocols : ["None"],
          unique_to_a: uniqueA.length > 0 ? uniqueA : ["None"],
          unique_to_b: uniqueB.length > 0 ? uniqueB : ["None"],
          shared_use_cases: sharedUseCases.length > 0 ? sharedUseCases : ["None — these devices serve different purposes"],
          open_source: deviceA.openSource === deviceB.openSource
            ? `Both are ${deviceA.openSource ? "open source" : "closed source"}`
            : `${deviceA.openSource ? deviceA.name : deviceB.name} is open source; ${!deviceA.openSource ? deviceA.name : deviceB.name} is closed source`,
        },
        recommendation: deviceA.category === deviceB.category
          ? `Both serve similar use cases (${deviceA.category}). Choose based on budget, specific protocol needs, and open-source preference.`
          : `These devices serve different domains (${deviceA.category} vs ${deviceB.category}). Consider both for comprehensive wireless testing.`,
      },
    });
  },
};

// ─── Export ───

export const hardwareTools: ToolDef[] = [
  hw_lookup,
  hw_search,
  hw_recommend,
  hw_compare,
];
