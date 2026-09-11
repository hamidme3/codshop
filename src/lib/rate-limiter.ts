/**
 * Moroccan CGNAT-Safe Sliding-Window Rate Limiter
 * Accommodates Moroccan Mobile Carrier NAT pools (Maroc Telecom, Inwi, Orange)
 * while stopping automated bot attacks and order flooding.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const maxWindow = 15 * 60 * 1000;
    for (const [key, entry] of memoryStore.entries()) {
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < maxWindow);
      if (entry.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const entry = memoryStore.get(key) || { timestamps: [] };

  // Filter timestamps within the current window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  entry.timestamps.push(now);
  memoryStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Composite Rate Limiter for Moroccan COD Orders:
 * - Phone Limit: 2 orders per 3 minutes per phone number (stops duplicate spam)
 * - CGNAT-aware IP Limit: 40 orders per 10 minutes per IP (won't block shared mobile cells)
 */
export function checkOrderRateLimit(ip: string, phone: string): { allowed: boolean; reason?: string } {
  if (phone) {
    const phoneKey = `order:phone:${phone.replace(/[^0-9]/g, '')}`;
    const phoneLimit = checkRateLimit(phoneKey, 2, 3 * 60 * 1000);
    if (!phoneLimit.allowed) {
      return {
        allowed: false,
        reason: 'Une commande récente a déjà été passée avec ce numéro. Veuillez patienter 3 minutes ou nous contacter sur WhatsApp.',
      };
    }
  }

  if (ip && ip !== '127.0.0.1' && ip !== '::1') {
    const ipKey = `order:ip:${ip}`;
    const ipLimit = checkRateLimit(ipKey, 40, 10 * 60 * 1000);
    if (!ipLimit.allowed) {
      return {
        allowed: false,
        reason: 'Trop de requêtes depuis ce réseau. Veuillez patienter quelques minutes.',
      };
    }
  }

  return { allowed: true };
}
