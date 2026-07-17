# Contributing to wifi-security-mcp

Thank you for your interest in contributing to wifi-security-mcp! This document provides guidelines and instructions to help you get started.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/badchars/wifi-security-mcp.git
cd wifi-security-mcp

# Install dependencies (Bun 1.3.9+ required)
bun install

# Build the project
bun run build

# Start in development mode (watch for changes)
bun run dev
```

## Project Structure

```
src/
├── index.ts                # Entry point, CLI flags, MCP server bootstrap
├── protocol/
│   └── tools.ts            # Tool registry — all 34 composite + 139 individual tools
├── types/
│   └── index.ts            # ToolDef, ToolContext, ToolResult interfaces
├── utils/
│   ├── cache.ts            # TTL cache implementation
│   └── rate-limiter.ts     # Per-provider rate limiter
├── providers/              # Individual tool providers
│   ├── recon/              # Wi-Fi reconnaissance & scanning
│   ├── wpa/                # WPA/WPA2/WPA3 analysis
│   ├── deauth/             # Deauthentication detection & analysis
│   ├── rogue-ap/           # Rogue access point identification
│   ├── pmkid/              # PMKID extraction & analysis
│   ├── handshake/          # Handshake capture & analysis
│   ├── eap/                # EAP/RADIUS auditing
│   ├── bluetooth/          # Bluetooth/BLE scanning
│   ├── rf/                 # RF spectrum analysis
│   └── meta/               # Server meta info
├── composite/              # Composite tools (multi-step workflows)
└── knowledge/              # Wireless security knowledge base
```

## Adding a New Tool

Each tool is defined using the `ToolDef` interface. Every tool has a name, description, a Zod input schema, and an async `execute` function.

### 1. Define the tool

Create or edit a file in the appropriate provider directory:

```typescript
import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json, text } from "../types/index.js";

export const myNewTool: ToolDef = {
  name: "my_new_tool",
  description: "Short description of what the tool does",
  schema: {
    query: z.string().describe("The search query or indicator"),
    limit: z.number().optional().default(10).describe("Maximum results to return"),
  },
  execute: async (args, ctx) => {
    const { query, limit } = args as { query: string; limit: number };

    const resp = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!resp.ok) {
      return text(`API error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    return json(data);
  },
};
```

### 2. Register the tool

Import and add the tool to the `allTools` array in `src/protocol/tools.ts`:

```typescript
import { myNewTool } from "../providers/myprovider/index.js";

// Add to the allTools array
export const allTools: ToolDef[] = [
  // ... existing tools
  myNewTool,
];
```

### 3. Test the tool

```bash
bun run src/index.ts --tool my_new_tool '{"query": "test"}'
```

## Adding a New Provider

1. Create a new directory under `src/providers/` named after the provider (e.g., `src/providers/newprovider/`).
2. Create an `index.ts` that exports one or more `ToolDef` objects.
3. If the provider requires an API key, add the key field to `ToolContext["config"]` in `src/types/index.ts`.
4. Handle missing API keys gracefully -- return a descriptive error message instead of throwing.
5. Add rate limiting using the shared `RateLimiter` from `src/utils/rate-limiter.ts`.
6. Add caching using the shared `TTLCache` from `src/utils/cache.ts`.
7. Register all tools in `src/protocol/tools.ts`.
8. Update tool counts in the README and CHANGELOG if applicable.

## Adding a Composite Tool

Composite tools orchestrate multiple individual tools into a single workflow:

1. Create a new file under `src/composite/` (e.g., `src/composite/full-audit.ts`).
2. Import the individual tools or provider functions you need.
3. Define the composite tool using the same `ToolDef` interface.
4. Register it in `src/protocol/tools.ts`.

## Guidelines

- **TypeScript strict mode** -- the project uses strict compiler settings. Fix all type errors before submitting.
- **Zod schemas** -- every tool input field must use Zod for validation with a `.describe()` call explaining the field.
- **Native `fetch()`** -- use the built-in `fetch()` for all HTTP API calls. Do not add HTTP client libraries.
- **Minimal dependencies** -- avoid adding new dependencies unless strictly necessary. The project intentionally keeps only 2 runtime deps.
- **Graceful API key handling** -- all API keys are optional. When a key is missing, return a clear error message explaining which key is needed and how to set it.
- **Conventional Commits** -- use the [Conventional Commits](https://www.conventionalcommits.org/) format for all commit messages:
  - `feat:` for new features or tools
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code refactoring
  - `chore:` for build/tooling changes
- **ESM imports** -- always use `.js` extensions in import paths (TypeScript ESM requirement).
- **No console.log in tool output** -- tool results go through the `text()` or `json()` helpers only.
- **Authorized use only** -- all tools are designed for authorized security testing and educational purposes.

## Submitting a Pull Request

1. Fork the repository and create a feature branch from `main`.
2. Make your changes following the guidelines above.
3. Ensure the project builds cleanly: `bun run build`
4. Test your changes with the CLI: `bun run src/index.ts --tool <tool_name> '<json_args>'`
5. Commit using Conventional Commits format.
6. Open a pull request against `main` with a clear description of what you changed and why.

## Reporting Issues

- Use [GitHub Issues](https://github.com/badchars/wifi-security-mcp/issues) for bug reports and feature requests.
- For security vulnerabilities, see [SECURITY.md](SECURITY.md) -- do **not** open a public issue.
- Include reproduction steps, expected behavior, and your environment details (OS, Bun/Node version).
