// In-memory OTP storage with 10-minute TTL
interface PhoneOtpEntry {
  otp: string;
  expiresAt: number;
  phone: string;
}

const otpStore = new Map<string, PhoneOtpEntry>();

export function normalizeMoroccanPhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-\.\(\)]/g, '');
  
  // Format: +2126XXXXXXXX or +2127XXXXXXXX
  if (/^\+212[67]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  // Format: 002126XXXXXXXX or 002127XXXXXXXX
  if (/^00212[67]\d{8}$/.test(cleaned)) {
    return '+' + cleaned.substring(2);
  }
  // Format: 06XXXXXXXX or 07XXXXXXXX
  if (/^0[67]\d{8}$/.test(cleaned)) {
    return '+212' + cleaned.substring(1);
  }
  // Format: 6XXXXXXXX or 7XXXXXXXX
  if (/^[67]\d{8}$/.test(cleaned)) {
    return '+212' + cleaned;
  }

  return null;
}

export function generateAndStoreOtp(normalizedPhone: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizedPhone, {
    otp,
    expiresAt,
    phone: normalizedPhone,
  });

  return otp;
}

export function verifyStoredOtp(normalizedPhone: string, code: string): boolean {
  const entry = otpStore.get(normalizedPhone);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedPhone);
    return false;
  }

  if (entry.otp === code.trim()) {
    otpStore.delete(normalizedPhone); // single-use
    return true;
  }

  return false;
}
