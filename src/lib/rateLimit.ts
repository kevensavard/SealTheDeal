import { NextRequest } from 'next/server';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (in production, use Redis)
const store: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (req: NextRequest): { success: boolean; limit: number; remaining: number; resetTime: number } => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit entry
    let entry = store[key];
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + windowMs
      };
      store[key] = entry;
    }

    // Increment count
    entry.count++;

    const remaining = Math.max(0, maxRequests - entry.count);
    const success = entry.count <= maxRequests;

    return {
      success,
      limit: maxRequests,
      remaining,
      resetTime: entry.resetTime
    };
  };
}

function getDefaultKey(req: NextRequest): string {
  // Use IP address as default key
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return `rate_limit:${ip}`;
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  options: RateLimitOptions
) {
  return async (req: NextRequest): Promise<Response> => {
    const limiter = rateLimit(options);
    const result = limiter(req);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          limit: result.limit,
          remaining: result.remaining,
          resetTime: result.resetTime
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(req);
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return response;
  };
}
