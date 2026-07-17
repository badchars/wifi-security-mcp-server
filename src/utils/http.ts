import { RateLimiter } from "./rate-limiter.js";
import { TTLCache } from "./cache.js";

const defaultLimiter = new RateLimiter(10, 60_000);
const responseCache = new TTLCache<any>(300_000);

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit & { cacheKey?: string; limiter?: RateLimiter } = {},
): Promise<T> {
  const { cacheKey, limiter, ...fetchOpts } = options;

  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached) return cached as T;
  }

  await (limiter || defaultLimiter).acquire();

  const res = await fetch(url, {
    ...fetchOpts,
    headers: {
      "User-Agent": "wifi-security-mcp/0.1.0",
      ...fetchOpts.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${url}`);
  }

  const data = await res.json() as T;

  if (cacheKey) {
    responseCache.set(cacheKey, data);
  }

  return data;
}

export async function apiFetchText(
  url: string,
  options: RequestInit & { cacheKey?: string; limiter?: RateLimiter } = {},
): Promise<string> {
  const { cacheKey, limiter, ...fetchOpts } = options;

  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached) return cached as string;
  }

  await (limiter || defaultLimiter).acquire();

  const res = await fetch(url, {
    ...fetchOpts,
    headers: {
      "User-Agent": "wifi-security-mcp/0.1.0",
      ...fetchOpts.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${url}`);
  }

  const text = await res.text();

  if (cacheKey) {
    responseCache.set(cacheKey, text);
  }

  return text;
}
