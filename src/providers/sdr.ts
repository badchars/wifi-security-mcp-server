import { z } from "zod";
import type { ToolDef, ToolContext, ToolResult } from "../types/index.js";
import { json, text } from "../types/index.js";
import { PENTEST_HARDWARE } from "../knowledge/index.js";
import type { PentestHardware } from "../knowledge/index.js";

// ─── Frequency reference database ───

interface FrequencyRef {
  protocol: string;
  application: string;
  frequency: string;
  modulation: string;
  bandwidth: string;
  hardware: string[];
  notes: string;
}

const FREQUENCY_DB: FrequencyRef[] = [
  { protocol: "EM4100 / HID Prox", application: "RFID Access Cards (LF)", frequency: "125 kHz", modulation: "ASK/FSK/PSK", bandwidth: "~15 kHz", hardware: ["proxmark3", "flipper-zero"], notes: "Low-frequency RFID. Trivially clonable." },
  { protocol: "NFC / Mifare", application: "Access Cards / Payment (HF)", frequency: "13.56 MHz", modulation: "ASK (100%/10%)", bandwidth: "~2 MHz", hardware: ["proxmark3", "flipper-zero", "libnfc"], notes: "ISO 14443 NFC. Mifare Classic has known crypto weaknesses." },
  { protocol: "FM Radio", application: "Broadcast FM", frequency: "87.5-108 MHz", modulation: "FM", bandwidth: "200 kHz", hardware: ["rtl-sdr", "hackrf"], notes: "Commercial FM broadcast. Receive-only analysis." },
  { protocol: "VHF Marine", application: "Maritime Communication", frequency: "156-162 MHz", modulation: "FM", bandwidth: "25 kHz", hardware: ["rtl-sdr", "hackrf"], notes: "Marine VHF channels. Channel 16 = emergency." },
  { protocol: "POCSAG", application: "Pager Messages", frequency: "148-174 / 450-470 MHz", modulation: "FSK", bandwidth: "25 kHz", hardware: ["rtl-sdr"], notes: "Unencrypted pager protocol. Decode with multimon-ng." },
  { protocol: "P25", application: "Public Safety Radio", frequency: "VHF/UHF (136-174 / 380-512 / 764-870 MHz)", modulation: "C4FM/CQPSK", bandwidth: "12.5 kHz", hardware: ["rtl-sdr", "hackrf"], notes: "Digital public safety. Decode with OP25 or DSD+." },
  { protocol: "Fixed Code Remote", application: "Garage Doors / Gates", frequency: "300-433 MHz", modulation: "ASK/OOK", bandwidth: "~200 kHz", hardware: ["flipper-zero", "hackrf", "yard-stick-one", "rtl-sdr"], notes: "Simple replay attack. No encryption." },
  { protocol: "KeeLoq Rolling Code", application: "Vehicle Key Fobs / Garages", frequency: "315/433 MHz", modulation: "ASK/OOK", bandwidth: "~200 kHz", hardware: ["hackrf", "yard-stick-one"], notes: "Rolling code. Requires RollJam for replay." },
  { protocol: "TPMS", application: "Tire Pressure Monitoring", frequency: "315/433 MHz", modulation: "FSK/ASK", bandwidth: "~200 kHz", hardware: ["rtl-sdr", "hackrf"], notes: "Unencrypted. Vehicle tracking possible via unique sensor IDs." },
  { protocol: "ISM Band Sensors", application: "Weather Stations / Doorbells / Sensors", frequency: "433.92 MHz", modulation: "ASK/OOK/FSK", bandwidth: "varies", hardware: ["rtl-sdr", "flipper-zero", "hackrf"], notes: "Decode 200+ sensor types with rtl_433." },
  { protocol: "LoRa", application: "Long-Range IoT", frequency: "433/868/915 MHz", modulation: "CSS (Chirp)", bandwidth: "125/250/500 kHz", hardware: ["hackrf", "limesdr"], notes: "CSS modulation. Decode with gr-lora." },
  { protocol: "Z-Wave", application: "Smart Home Automation", frequency: "868.42/908.42 MHz", modulation: "FSK/GFSK", bandwidth: "200 kHz", hardware: ["hackrf", "rtl-sdr"], notes: "S0 security key is known. S2 is more secure." },
  { protocol: "GSM", application: "2G Cellular", frequency: "850/900/1800/1900 MHz", modulation: "GMSK", bandwidth: "200 kHz", hardware: ["hackrf", "limesdr", "bladerf"], notes: "A5/1 encryption cracked. IMSI catching possible." },
  { protocol: "ADS-B", application: "Aircraft Tracking", frequency: "1090 MHz", modulation: "PPM", bandwidth: "~2 MHz", hardware: ["rtl-sdr"], notes: "Unencrypted aircraft transponder. Decode with dump1090." },
  { protocol: "GPS L1 C/A", application: "Navigation / Timing", frequency: "1575.42 MHz", modulation: "BPSK/CDMA", bandwidth: "2.046 MHz", hardware: ["hackrf", "limesdr"], notes: "Spoofable with gps-sdr-sim + HackRF." },
  { protocol: "DECT", application: "Cordless Phones", frequency: "1880-1900 MHz", modulation: "GFSK", bandwidth: "1.728 MHz", hardware: ["hackrf"], notes: "Older systems unencrypted. Decode with gr-dect2 or dedected." },
  { protocol: "Bluetooth BR/EDR", application: "Classic Bluetooth", frequency: "2.4 GHz (2402-2480 MHz)", modulation: "GFSK", bandwidth: "1 MHz per channel", hardware: ["ubertooth"], notes: "79 channels, frequency hopping. Sniff with Ubertooth." },
  { protocol: "BLE", application: "Bluetooth Low Energy", frequency: "2.4 GHz (2402-2480 MHz)", modulation: "GFSK", bandwidth: "2 MHz per channel", hardware: ["ubertooth", "nrf52840"], notes: "40 channels. Advertising on 37/38/39." },
  { protocol: "WiFi (2.4 GHz)", application: "WLAN", frequency: "2.4 GHz (2412-2484 MHz)", modulation: "OFDM/DSSS", bandwidth: "20/40 MHz", hardware: ["hackrf", "wifi-adapter"], notes: "802.11b/g/n. 14 channels (region dependent)." },
  { protocol: "Zigbee / Thread", application: "Smart Home Mesh", frequency: "2.4 GHz", modulation: "O-QPSK", bandwidth: "2 MHz", hardware: ["nrf52840", "ubertooth", "killerbee"], notes: "IEEE 802.15.4. 16 channels (11-26)." },
  { protocol: "WiFi (5 GHz)", application: "WLAN", frequency: "5 GHz (5180-5825 MHz)", modulation: "OFDM", bandwidth: "20/40/80/160 MHz", hardware: ["hackrf", "wifi-adapter"], notes: "802.11a/n/ac. Many more channels, less congested." },
];

// ─── SDR software setup database ───

interface SdrSetup {
  hardware: string;
  os: string;
  installCommands: string[];
  configNotes: string[];
  testCommands: string[];
}

const SDR_SETUPS: Record<string, Record<string, SdrSetup>> = {
  hackrf: {
    linux: {
      hardware: "HackRF One",
      os: "Linux",
      installCommands: [
        "sudo apt update && sudo apt install -y hackrf libhackrf-dev",
        "sudo apt install -y gnuradio gr-osmosdr gqrx-sdr",
        "sudo apt install -y inspectrum universal-radio-hacker",
        "pip3 install rfcat",
        "# Update firmware:",
        "hackrf_spiflash -w hackrf_one_usb.bin",
      ],
      configNotes: [
        "Add user to plugdev group: sudo usermod -aG plugdev $USER",
        "Ensure udev rules are installed: sudo cp 53-hackrf.rules /etc/udev/rules.d/",
        "Reload udev: sudo udevadm control --reload-rules && sudo udevadm trigger",
      ],
      testCommands: [
        "hackrf_info  # Should show HackRF device info",
        "hackrf_transfer -r /dev/null -f 100000000 -s 2000000 -n 1000000  # Quick RX test",
      ],
    },
    macos: {
      hardware: "HackRF One",
      os: "macOS",
      installCommands: [
        "brew install hackrf gnuradio gqrx",
        "brew install inspectrum",
        "pip3 install rfcat urh",
      ],
      configNotes: [
        "HackRF drivers are included via Homebrew",
        "GNU Radio Companion: gnuradio-companion",
        "If USB issues: brew install libusb",
      ],
      testCommands: [
        "hackrf_info",
        "gqrx  # Open GQRX, set to HackRF device",
      ],
    },
    windows: {
      hardware: "HackRF One",
      os: "Windows",
      installCommands: [
        "# Install Zadig for USB drivers: https://zadig.akeo.ie/",
        "# Install SDR# or GQRX-Win",
        "# Install GNU Radio via radioconda: conda install -c conda-forge gnuradio",
        "pip install urh",
      ],
      configNotes: [
        "Use Zadig to install WinUSB driver for HackRF",
        "SDR# is the easiest spectrum analyzer for Windows",
        "GNU Radio works via radioconda Anaconda distribution",
      ],
      testCommands: [
        "hackrf_info.exe",
      ],
    },
  },
  rtlsdr: {
    linux: {
      hardware: "RTL-SDR v4",
      os: "Linux",
      installCommands: [
        "sudo apt update && sudo apt install -y rtl-sdr librtlsdr-dev",
        "sudo apt install -y gqrx-sdr gnuradio gr-osmosdr",
        "sudo apt install -y rtl-433 multimon-ng dump1090-mutability",
        "pip3 install pyrtlsdr",
      ],
      configNotes: [
        "Blacklist DVB-T kernel module: echo 'blacklist dvb_usb_rtl28xxu' | sudo tee /etc/modprobe.d/blacklist-rtl.conf",
        "Reload modules: sudo modprobe -r dvb_usb_rtl28xxu",
        "Add user to plugdev group: sudo usermod -aG plugdev $USER",
      ],
      testCommands: [
        "rtl_test -t  # Test dongle",
        "rtl_fm -f 100000000 -M fm -s 200000 -r 48000 - | aplay -r 48000 -f S16_LE  # Listen to FM radio",
        "rtl_433  # Auto-decode sub-GHz signals",
      ],
    },
    macos: {
      hardware: "RTL-SDR v4",
      os: "macOS",
      installCommands: [
        "brew install rtl-sdr gnuradio gqrx",
        "brew install rtl_433 multimon-ng",
        "pip3 install pyrtlsdr",
      ],
      configNotes: [
        "No kernel module blacklisting needed on macOS",
        "USB access should work out of the box",
      ],
      testCommands: [
        "rtl_test -t",
        "rtl_433  # Scan for sub-GHz signals",
      ],
    },
    windows: {
      hardware: "RTL-SDR v4",
      os: "Windows",
      installCommands: [
        "# Install Zadig: https://zadig.akeo.ie/ (set RTL2838 to WinUSB driver)",
        "# Install SDR#: https://airspy.com/download/",
        "# Install rtl_433 from GitHub releases",
        "# Install dump1090 for ADS-B",
      ],
      configNotes: [
        "Use Zadig to replace default driver with WinUSB",
        "SDR# is the primary receiver software on Windows",
      ],
      testCommands: [
        "rtl_test.exe -t",
      ],
    },
  },
  limesdr: {
    linux: {
      hardware: "LimeSDR Mini 2.0",
      os: "Linux",
      installCommands: [
        "sudo add-apt-repository -y ppa:myriadrf/drivers",
        "sudo apt update && sudo apt install -y limesuite limesuite-udev soapysdr-module-lms7",
        "sudo apt install -y gnuradio gr-limesdr",
        "pip3 install pyLMS7002M",
      ],
      configNotes: [
        "LimeSDR uses SoapySDR abstraction layer",
        "Full-duplex capable — can TX and RX simultaneously",
        "Update firmware: LimeUtil --update",
      ],
      testCommands: [
        "LimeUtil --find  # Detect LimeSDR",
        "LimeQuickTest  # Run self-test",
        "SoapySDRUtil --find  # List SoapySDR devices",
      ],
    },
    macos: {
      hardware: "LimeSDR Mini 2.0",
      os: "macOS",
      installCommands: [
        "brew install limesuite soapysdr",
        "brew install gnuradio",
      ],
      configNotes: [
        "SoapySDR provides device abstraction",
        "May need: brew install libusb",
      ],
      testCommands: [
        "LimeUtil --find",
        "SoapySDRUtil --find",
      ],
    },
    windows: {
      hardware: "LimeSDR Mini 2.0",
      os: "Windows",
      installCommands: [
        "# Download LimeSuite from: https://github.com/myriadrf/LimeSuite/releases",
        "# Install PothosSDR bundle (includes SoapySDR + GNU Radio)",
      ],
      configNotes: [
        "Use PothosSDR for integrated SDR environment on Windows",
        "WinUSB driver via Zadig if needed",
      ],
      testCommands: [
        "LimeUtil --find",
      ],
    },
  },
  bladerf: {
    linux: {
      hardware: "bladeRF 2.0 micro",
      os: "Linux",
      installCommands: [
        "sudo add-apt-repository ppa:nuandllc/bladerf",
        "sudo apt update && sudo apt install -y bladerf libbladerf-dev bladerf-fpga-hostedx40",
        "sudo apt install -y gnuradio gr-osmosdr",
      ],
      configNotes: [
        "FPGA image must be loaded: bladeRF-cli -l hostedx40.rbf",
        "Full-duplex capable",
        "Supports 47 MHz to 6 GHz",
      ],
      testCommands: [
        "bladeRF-cli -p  # Probe for devices",
        "bladeRF-cli -i  # Interactive CLI",
      ],
    },
    macos: {
      hardware: "bladeRF 2.0 micro",
      os: "macOS",
      installCommands: [
        "brew install bladerf gnuradio",
      ],
      configNotes: [
        "FPGA image loading required on first use",
      ],
      testCommands: [
        "bladeRF-cli -p",
      ],
    },
    windows: {
      hardware: "bladeRF 2.0 micro",
      os: "Windows",
      installCommands: [
        "# Download bladeRF CLI from: https://github.com/Nuand/bladeRF/releases",
        "# Install Zadig for USB drivers",
      ],
      configNotes: [
        "Use Zadig for WinUSB driver installation",
      ],
      testCommands: [
        "bladeRF-cli.exe -p",
      ],
    },
  },
};

// ─── Tool 1: sdr_hardware_guide ───

const sdrHardwareGuide: ToolDef = {
  name: "sdr_hardware_guide",
  description:
    "SDR and pentest hardware selection guide. Recommends hardware from the PENTEST_HARDWARE database based on use case (wifi, bluetooth, sub-GHz, cellular, GPS, LoRa, Zigbee) and optional budget constraint.",
  schema: {
    use_case: z
      .enum(["wifi", "bluetooth", "subghz", "cellular", "gps", "lora", "zigbee"])
      .describe("Primary use case for the SDR/pentest hardware"),
    budget: z
      .string()
      .optional()
      .describe("Maximum budget (e.g. '$100', '$500', '$1000'). Returns only hardware within budget."),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const useCase = args.use_case as string;
    const budget = args.budget as string | undefined;

    let maxBudget = Infinity;
    if (budget) {
      const budgetMatch = budget.match(/\$?\s*([\d,]+)/);
      if (budgetMatch) {
        maxBudget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
      }
    }

    // Map use cases to hardware categories and relevant protocols
    const useCaseMapping: Record<string, { categories: string[]; keywords: string[] }> = {
      wifi: { categories: ["wifi", "multi"], keywords: ["wifi", "802.11", "wlan", "monitor mode"] },
      bluetooth: { categories: ["bluetooth", "multi", "iot"], keywords: ["bluetooth", "ble", "2.4 ghz"] },
      subghz: { categories: ["sdr", "multi"], keywords: ["sub-ghz", "315", "433", "868", "915", "300-928"] },
      cellular: { categories: ["sdr"], keywords: ["gsm", "lte", "cellular", "imsi"] },
      gps: { categories: ["sdr"], keywords: ["gps", "gnss", "1575"] },
      lora: { categories: ["sdr", "iot"], keywords: ["lora", "css", "868", "915"] },
      zigbee: { categories: ["iot", "sdr"], keywords: ["zigbee", "802.15.4", "thread"] },
    };

    const mapping = useCaseMapping[useCase] || { categories: ["sdr"], keywords: [] };

    // Filter hardware
    let results = PENTEST_HARDWARE.filter((hw) => {
      // Category match
      if (mapping.categories.includes(hw.category)) return true;

      // Keyword match in capabilities, protocols, or description
      const hwText = [...hw.capabilities, ...hw.protocols, hw.description].join(" ").toLowerCase();
      return mapping.keywords.some((kw) => hwText.includes(kw.toLowerCase()));
    });

    // Budget filter
    if (maxBudget < Infinity) {
      results = results.filter((hw) => {
        const priceMatch = hw.priceRange.match(/\$?([\d,]+)/);
        if (!priceMatch) return true;
        const price = parseInt(priceMatch[1].replace(/,/g, ""), 10);
        return price <= maxBudget;
      });
    }

    // Sort by relevance (category match first, then price)
    results.sort((a, b) => {
      const aCategory = mapping.categories.includes(a.category) ? 0 : 1;
      const bCategory = mapping.categories.includes(b.category) ? 0 : 1;
      if (aCategory !== bCategory) return aCategory - bCategory;

      const aPrice = parseInt((a.priceRange.match(/\$?([\d,]+)/) || ["0", "0"])[1].replace(/,/g, ""), 10);
      const bPrice = parseInt((b.priceRange.match(/\$?([\d,]+)/) || ["0", "0"])[1].replace(/,/g, ""), 10);
      return aPrice - bPrice;
    });

    if (results.length === 0) {
      return text(`No hardware found for use case '${useCase}'${budget ? ` within budget ${budget}` : ""}. Try increasing your budget or broadening the use case.`);
    }

    return json({
      useCase,
      budget: budget || "unlimited",
      recommendedHardware: results.map((hw) => ({
        id: hw.id,
        name: hw.name,
        manufacturer: hw.manufacturer,
        price: hw.priceRange,
        category: hw.category,
        capabilities: hw.capabilities,
        frequencies: hw.frequencies,
        protocols: hw.protocols,
        interfaces: hw.interfaces,
        openSource: hw.openSource,
        firmwareUrl: hw.firmwareUrl,
        description: hw.description,
        useCases: hw.useCases,
      })),
      buyingAdvice: {
        bestValue: results.length > 0 ? results[0].name : "N/A",
        mostCapable: results.length > 0 ? results.reduce((a, b) => a.capabilities.length > b.capabilities.length ? a : b).name : "N/A",
      },
    });
  },
};

// ─── Tool 2: sdr_setup_guide ───

const sdrSetupGuide: ToolDef = {
  name: "sdr_setup_guide",
  description:
    "SDR software setup guide. Provides platform-specific installation commands, configuration notes, and test commands for the specified SDR hardware and operating system.",
  schema: {
    hardware: z
      .enum(["hackrf", "rtlsdr", "limesdr", "bladerf"])
      .describe("SDR hardware platform"),
    os: z
      .enum(["linux", "macos", "windows"])
      .describe("Target operating system"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const hardware = args.hardware as string;
    const os = args.os as string;

    const setupData = SDR_SETUPS[hardware];
    if (!setupData) {
      return text(`No setup guide available for '${hardware}'. Supported: hackrf, rtlsdr, limesdr, bladerf`);
    }

    const setup = setupData[os];
    if (!setup) {
      return text(`No setup guide available for '${hardware}' on '${os}'. Supported OS: linux, macos, windows`);
    }

    // Common tools that work with all SDRs
    const commonTools = [
      { name: "GNU Radio", description: "Signal processing framework with visual flowgraph editor", install: os === "linux" ? "sudo apt install gnuradio" : os === "macos" ? "brew install gnuradio" : "conda install -c conda-forge gnuradio" },
      { name: "GQRX", description: "Spectrum analyzer and waterfall display", install: os === "linux" ? "sudo apt install gqrx-sdr" : os === "macos" ? "brew install gqrx" : "Download from https://gqrx.dk/" },
      { name: "inspectrum", description: "Visual signal analysis tool for captured IQ data", install: os === "linux" ? "sudo apt install inspectrum" : os === "macos" ? "brew install inspectrum" : "Build from source" },
      { name: "Universal Radio Hacker", description: "GUI for protocol analysis, fuzzing, and signal investigation", install: `pip3 install urh` },
      { name: "rtl_433", description: "Automatic decoder for 200+ sub-GHz protocols", install: os === "linux" ? "sudo apt install rtl-433" : os === "macos" ? "brew install rtl_433" : "Download from GitHub releases" },
    ];

    return json({
      hardware: setup.hardware,
      os: setup.os,
      installCommands: setup.installCommands,
      configNotes: setup.configNotes,
      testCommands: setup.testCommands,
      commonTools,
      additionalNotes: [
        "Always update SDR firmware to latest version before use",
        "Use appropriate antennas for target frequency range",
        os === "linux" ? "Log out and log back in after adding user to plugdev group" : null,
        os === "windows" ? "Zadig is essential for proper USB driver installation" : null,
      ].filter(Boolean),
    });
  },
};

// ─── Tool 3: sdr_frequency_guide ───

const sdrFrequencyGuide: ToolDef = {
  name: "sdr_frequency_guide",
  description:
    "Frequency reference guide for RF protocols and applications. Look up frequency, modulation, bandwidth, and required hardware for any wireless protocol or application.",
  schema: {
    protocol: z
      .string()
      .describe("Protocol name or application to look up (e.g. 'LoRa', 'Zigbee', 'GPS', 'ADS-B', 'TPMS', 'POCSAG', 'WiFi', 'Bluetooth', 'Z-Wave', 'garage door')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const query = (args.protocol as string).toLowerCase();

    const matches = FREQUENCY_DB.filter((f) => {
      const searchText = `${f.protocol} ${f.application} ${f.notes}`.toLowerCase();
      return searchText.includes(query);
    });

    if (matches.length === 0) {
      // Fuzzy search: try partial word matching
      const words = query.split(/\s+/);
      const fuzzyMatches = FREQUENCY_DB.filter((f) => {
        const searchText = `${f.protocol} ${f.application} ${f.notes}`.toLowerCase();
        return words.some((w) => searchText.includes(w));
      });

      if (fuzzyMatches.length === 0) {
        return json({
          query,
          matches: [],
          message: "No protocols found matching the query.",
          availableProtocols: FREQUENCY_DB.map((f) => f.protocol),
        });
      }

      return json({
        query,
        note: "No exact match. Showing partial matches.",
        matches: fuzzyMatches.map((f) => ({
          protocol: f.protocol,
          application: f.application,
          frequency: f.frequency,
          modulation: f.modulation,
          bandwidth: f.bandwidth,
          recommendedHardware: f.hardware,
          notes: f.notes,
        })),
      });
    }

    return json({
      query,
      matchCount: matches.length,
      frequencies: matches.map((f) => ({
        protocol: f.protocol,
        application: f.application,
        frequency: f.frequency,
        modulation: f.modulation,
        bandwidth: f.bandwidth,
        recommendedHardware: f.hardware,
        notes: f.notes,
      })),
    });
  },
};

// ─── Tool 4: sdr_gnuradio_flowgraph ───

const sdrGnuradioFlowgraph: ToolDef = {
  name: "sdr_gnuradio_flowgraph",
  description:
    "Generate a GnuRadio Companion flowgraph description for common SDR tasks. Provides block-by-block flowgraph structure for signal capture, replay, or analysis at the specified frequency and modulation.",
  schema: {
    task: z
      .enum(["capture", "replay", "analyze"])
      .describe("SDR task: capture (record IQ), replay (transmit recorded IQ), analyze (demodulate and display)"),
    frequency: z
      .string()
      .describe("Center frequency (e.g. '433.92 MHz', '2.4 GHz', '1575.42 MHz')"),
    modulation: z
      .string()
      .describe("Signal modulation type (e.g. 'ASK', 'FSK', 'GFSK', 'FM', 'AM', 'OFDM')"),
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const task = args.task as string;
    const frequency = args.frequency as string;
    const modulation = args.modulation as string;

    // Parse frequency
    const freqMatch = frequency.match(/([\d.]+)\s*(MHz|GHz|kHz)?/i);
    let freqHz = 433920000;
    if (freqMatch) {
      let val = parseFloat(freqMatch[1]);
      const unit = (freqMatch[2] || "MHz").toLowerCase();
      if (unit === "ghz") val *= 1e9;
      else if (unit === "mhz") val *= 1e6;
      else if (unit === "khz") val *= 1e3;
      freqHz = Math.round(val);
    }

    // Determine sample rate based on signal type
    const modUpper = modulation.toUpperCase();
    let sampleRate = 2000000; // 2 MHz default
    if (modUpper === "OFDM" || modUpper === "FM") sampleRate = 20000000;
    if (modUpper === "AM" || modUpper === "ASK" || modUpper === "OOK") sampleRate = 2000000;

    interface FlowGraphBlock {
      block: string;
      type: string;
      parameters: Record<string, string>;
      connections: string[];
      notes: string;
    }

    let blocks: FlowGraphBlock[] = [];
    let description = "";

    switch (task) {
      case "capture":
        description = `Capture IQ data at ${frequency} to file for offline analysis`;
        blocks = [
          {
            block: "osmocom_source",
            type: "Source",
            parameters: {
              "Device Arguments": "hackrf=0",
              "Sample Rate": `${sampleRate}`,
              "Center Frequency": `${freqHz}`,
              "RF Gain": "30",
              "IF Gain": "30",
              "BB Gain": "30",
            },
            connections: ["-> Throttle"],
            notes: "Change device arguments for your SDR (hackrf, rtl, lime, etc.)",
          },
          {
            block: "throttle",
            type: "Flow Control",
            parameters: { "Sample Rate": `${sampleRate}` },
            connections: ["-> QT GUI Sink", "-> File Sink"],
            notes: "Throttle prevents CPU overload during capture",
          },
          {
            block: "qt_gui_waterfall_sink",
            type: "Visualization",
            parameters: {
              "FFT Size": "1024",
              "Center Frequency": `${freqHz}`,
              "Bandwidth": `${sampleRate}`,
            },
            connections: [],
            notes: "Real-time waterfall display for monitoring capture",
          },
          {
            block: "file_sink",
            type: "Output",
            parameters: {
              "File": "capture.cf32",
              "Type": "Complex Float 32",
            },
            connections: [],
            notes: "Save raw IQ data as complex float32 for inspectrum/URH analysis",
          },
        ];
        break;

      case "replay":
        description = `Replay previously captured IQ data at ${frequency}`;
        blocks = [
          {
            block: "file_source",
            type: "Source",
            parameters: {
              "File": "capture.cf32",
              "Type": "Complex Float 32",
              "Repeat": "No",
            },
            connections: ["-> Throttle"],
            notes: "Load captured IQ file",
          },
          {
            block: "throttle",
            type: "Flow Control",
            parameters: { "Sample Rate": `${sampleRate}` },
            connections: ["-> Multiply Const", "-> QT GUI Sink"],
            notes: "Match original capture sample rate",
          },
          {
            block: "multiply_const",
            type: "Math",
            parameters: { "Constant": "0.9" },
            connections: ["-> osmocom Sink"],
            notes: "Adjust TX amplitude (0.0-1.0). Start low to avoid overdriving.",
          },
          {
            block: "osmocom_sink",
            type: "Sink (TX)",
            parameters: {
              "Device Arguments": "hackrf=0",
              "Sample Rate": `${sampleRate}`,
              "Center Frequency": `${freqHz}`,
              "RF Gain": "0",
              "IF Gain": "30",
              "BB Gain": "20",
            },
            connections: [],
            notes: "TX output. IMPORTANT: Ensure you have legal authorization to transmit!",
          },
          {
            block: "qt_gui_waterfall_sink",
            type: "Visualization",
            parameters: {
              "FFT Size": "1024",
              "Center Frequency": `${freqHz}`,
            },
            connections: [],
            notes: "Monitor transmitted signal",
          },
        ];
        break;

      case "analyze":
        description = `Demodulate and analyze ${modulation} signal at ${frequency}`;
        blocks = [
          {
            block: "osmocom_source",
            type: "Source",
            parameters: {
              "Device Arguments": "hackrf=0",
              "Sample Rate": `${sampleRate}`,
              "Center Frequency": `${freqHz}`,
              "RF Gain": "30",
              "IF Gain": "30",
            },
            connections: ["-> Low Pass Filter"],
            notes: "Live SDR source. Substitute file_source for offline analysis.",
          },
          {
            block: "low_pass_filter",
            type: "Filter",
            parameters: {
              "Cutoff Frequency": `${Math.min(sampleRate / 4, 500000)}`,
              "Transition Width": `${Math.min(sampleRate / 8, 100000)}`,
              "Window": "Hamming",
            },
            connections: modUpper === "FM" || modUpper === "GFSK" || modUpper === "FSK"
              ? ["-> FM Demod"]
              : modUpper === "AM" || modUpper === "ASK" || modUpper === "OOK"
              ? ["-> Complex to Mag"]
              : ["-> Demod Block"],
            notes: "Filter to signal bandwidth",
          },
        ];

        // Add demodulation blocks based on modulation type
        if (modUpper === "FM" || modUpper === "GFSK" || modUpper === "FSK") {
          blocks.push({
            block: "fm_demod",
            type: "Demodulation",
            parameters: {
              "Channel Rate": `${sampleRate}`,
              "Audio Decimation": "10",
              "Max Deviation": modUpper === "FM" ? "75000" : "50000",
              "Tau": "0",
            },
            connections: ["-> QT GUI Time Sink", "-> Binary Slicer (for digital)"],
            notes: `${modulation} demodulation. Adjust max deviation for signal.`,
          });
        } else if (modUpper === "AM" || modUpper === "ASK" || modUpper === "OOK") {
          blocks.push({
            block: "complex_to_mag",
            type: "Type Conversion",
            parameters: {},
            connections: ["-> QT GUI Time Sink", "-> Threshold (for digital)"],
            notes: "Amplitude demodulation for ASK/OOK/AM",
          });
          blocks.push({
            block: "threshold",
            type: "Level Detection",
            parameters: {
              "High": "0.5",
              "Low": "0.2",
              "Initial State": "0",
            },
            connections: ["-> File Sink (decoded bits)"],
            notes: "Threshold detector for digital ASK/OOK. Adjust levels based on signal amplitude.",
          });
        } else {
          blocks.push({
            block: "custom_demod",
            type: "Demodulation",
            parameters: { "Type": modulation },
            connections: ["-> QT GUI Sink"],
            notes: `Custom demod needed for ${modulation}. Use appropriate GNU Radio block.`,
          });
        }

        blocks.push({
          block: "qt_gui_time_sink",
          type: "Visualization",
          parameters: { "Number of Points": "1024", "Sample Rate": `${sampleRate / 10}` },
          connections: [],
          notes: "Time-domain view of demodulated signal",
        });
        blocks.push({
          block: "qt_gui_freq_sink",
          type: "Visualization",
          parameters: { "FFT Size": "1024", "Center Frequency": `${freqHz}` },
          connections: [],
          notes: "Frequency-domain (spectrum) view",
        });
        break;
    }

    return json({
      task,
      description,
      frequency,
      frequencyHz: freqHz,
      modulation,
      sampleRate,
      flowgraph: {
        blockCount: blocks.length,
        blocks,
      },
      usage: [
        "1. Open GNU Radio Companion: gnuradio-companion",
        "2. Add blocks as described above",
        "3. Connect blocks following the connection flow",
        "4. Adjust parameters for your specific SDR and signal",
        "5. Run flowgraph (F6) and observe results",
      ],
      alternativeTools: [
        { tool: "inspectrum", command: "inspectrum capture.cf32", use: "Visual IQ analysis of captured files" },
        { tool: "URH", command: "urh", use: "GUI protocol analysis and demodulation" },
        { tool: "SigDigger", command: "SigDigger", use: "Signal analysis and inspection" },
      ],
    });
  },
};

// ─── Export All SDR Tools ───

export const sdrTools: ToolDef[] = [
  sdrHardwareGuide,
  sdrSetupGuide,
  sdrFrequencyGuide,
  sdrGnuradioFlowgraph,
];
