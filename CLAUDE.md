# wifi-security-mcp — Full-Spectrum Wireless Security MCP Server

## Overview
34 composite tools (139 individual tools) MCP server for wireless security pentesting: Wi-Fi reconnaissance, WPA/WPA2/WPA3 analysis, deauthentication detection, rogue AP identification, PMKID extraction, handshake analysis, EAP/RADIUS auditing, Bluetooth/BLE scanning, RF spectrum analysis.

## Architecture
- **Runtime:** Bun 1.3.9+ (dev), Node.js (publish)
- **Dependencies:** @modelcontextprotocol/sdk, zod
- **Transport:** stdio only
- **Pattern:** Providers in `src/providers/`, composites in `src/composite/`, knowledge base in `src/knowledge/`, tools registered in `src/protocol/tools.ts`

## Key Rules
- TypeScript strict mode, English code/comments
- Native `fetch()` for HTTP APIs
- Every tool schema field must have `.describe()`
- API keys always optional — graceful error when missing
- Rate limiter + TTL cache per provider
- Import paths use `.js` extension (ESM)

## Directory Layout
```
src/
├── index.ts                # Entry point, CLI flags, MCP server bootstrap
├── protocol/
│   └── tools.ts            # Tool registry — all tools registered here
├── types/
│   └── index.ts            # ToolDef, ToolContext, ToolResult interfaces
├── utils/
│   ├── cache.ts            # TTL cache implementation
│   └── rate-limiter.ts     # Per-provider rate limiter
├── providers/              # Individual tool providers
├── composite/              # Composite tools (multi-step workflows)
└── knowledge/              # Wireless security knowledge base
```

## Commands
```bash
bun install          # Install deps
bun run dev          # Dev mode (watch)
bun run build        # Build for npm
bun run src/index.ts --help   # CLI help
bun run src/index.ts --list   # List all tools
bun run src/index.ts --tool <name> '<json>'  # Run single tool
```
