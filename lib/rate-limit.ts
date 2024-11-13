// @/lib/rate-limit.ts
interface RateLimitConfig {
  interval: number;  // Time window in milliseconds
  limit?: number;    // Maximum number of requests per interval
  uniqueTokenPerInterval?: number;  // Maximum number of unique tokens to track
}

interface RateLimitState {
  timestamp: number;
  count: number;
}

const defaultLimit = 10;
const defaultUniqueTokens = 500;
const tokenCache = new Map<string, RateLimitState>();

export function rateLimit(config: RateLimitConfig) {
  const { 
    interval, 
    limit = defaultLimit,
    uniqueTokenPerInterval = defaultUniqueTokens 
  } = config;

  return {
    check: async (identifier: string): Promise<{
      success: boolean;
      limit: number;
      remaining: number;
      reset: number;
    }> => {
      const now = Date.now();
      const state = tokenCache.get(identifier);

      // Clean up expired tokens if we're at the unique token limit
      if (tokenCache.size >= uniqueTokenPerInterval) {
        for (const [key, value] of tokenCache.entries()) {
          if (now - value.timestamp > interval) {
            tokenCache.delete(key);
          }
        }
      }

      if (!state) {
        // First request from this identifier
        if (tokenCache.size >= uniqueTokenPerInterval) {
          return {
            success: false,
            limit,
            remaining: 0,
            reset: now + interval,
          };
        }
        
        tokenCache.set(identifier, { timestamp: now, count: 1 });
        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: now + interval,
        };
      }

      if (now - state.timestamp > interval) {
        // Reset window
        tokenCache.set(identifier, { timestamp: now, count: 1 });
        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: now + interval,
        };
      }

      if (state.count >= limit) {
        // Rate limit exceeded
        return {
          success: false,
          limit,
          remaining: 0,
          reset: state.timestamp + interval,
        };
      }

      // Increment counter
      state.count++;
      tokenCache.set(identifier, state);

      return {
        success: true,
        limit,
        remaining: limit - state.count,
        reset: state.timestamp + interval,
      };
    },
  };
}
