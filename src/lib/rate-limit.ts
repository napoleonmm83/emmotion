import { Redis } from "@upstash/redis";

/**
 * Rate Limiting mit Upstash Redis
 * Fallback auf In-Memory wenn Redis nicht konfiguriert
 */

// In-Memory Fallback (nur für lokale Entwicklung)
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  window: number;
  /** Prefix for the rate limit key */
  prefix: string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if Upstash Redis is configured
 */
function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Get Redis client (lazy initialization)
 */
let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  return redisClient;
}

/**
 * In-Memory Rate Limiting (Fallback)
 */
function inMemoryRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = config.window * 1000;
  const record = inMemoryStore.get(key);

  if (!record || now > record.resetTime) {
    inMemoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return {
      success: true,
      remaining: config.limit - 1,
      resetIn: config.window,
    };
  }

  if (record.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return {
    success: true,
    remaining: config.limit - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Redis Rate Limiting with Upstash (Sliding Window)
 */
async function redisRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) {
    return inMemoryRateLimit(identifier, config);
  }

  const key = `rate_limit:${config.prefix}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.window;

  try {
    // Use a pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request with timestamp as score
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

    // Set expiry on the key
    pipeline.expire(key, config.window);

    const results = await pipeline.exec();
    const currentCount = (results[1] as number) || 0;

    if (currentCount >= config.limit) {
      return {
        success: false,
        remaining: 0,
        resetIn: config.window,
      };
    }

    return {
      success: true,
      remaining: config.limit - currentCount - 1,
      resetIn: config.window,
    };
  } catch (error) {
    console.error("Redis rate limit error, falling back to in-memory:", error);
    // Fallback to in-memory on Redis error
    return inMemoryRateLimit(identifier, config);
  }
}

/**
 * Main rate limit function - uses Redis when available, falls back to in-memory
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (isRedisConfigured()) {
    return redisRateLimit(identifier, config);
  }

  // In-memory fallback for local development
  return inMemoryRateLimit(identifier, config);
}

// Pre-configured rate limiters for common use cases

/**
 * Contact form rate limiter - 5 requests per hour per IP
 */
export async function rateLimitContact(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, {
    limit: 5,
    window: 3600, // 1 hour
    prefix: "contact",
  });
}

/**
 * Konfigurator rate limiter - 10 requests per hour per IP
 */
export async function rateLimitKonfigurator(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, {
    limit: 10,
    window: 3600, // 1 hour
    prefix: "konfigurator",
  });
}

/**
 * Blob upload rate limiter - 10 uploads per hour per IP
 */
export async function rateLimitBlobUpload(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, {
    limit: 10,
    window: 3600, // 1 hour
    prefix: "blob_upload",
  });
}

/**
 * General API rate limiter - 100 requests per minute per IP
 */
export async function rateLimitAPI(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, {
    limit: 100,
    window: 60, // 1 minute
    prefix: "api",
  });
}
