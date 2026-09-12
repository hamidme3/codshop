/**
 * Moroccan Phone Validation and Normalization Engine
 * Handles Mobile (06, 07), Landlines/VoIP (05), and international prefixes (+212, 00212, 212).
 */

export interface PhoneValidationResult {
  isValid: boolean;
  cleanPhone: string; // 06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX
  intlPhone: string;  // +2126XXXXXXXX, +2127XXXXXXXX, +2125XXXXXXXX
  waPhone: string;    // 2126XXXXXXXX
  type: 'mobile' | 'landline' | 'unknown';
  error?: string;
}

export function validateAndNormalizeMoroccanPhone(rawPhone: string | null | undefined): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      cleanPhone: '',
      intlPhone: '',
      waPhone: '',
      type: 'unknown',
      error: 'Numéro de téléphone requis',
    };
  }

  // Strip spaces, dashes, dots, parentheses, and zero-width characters
  const clean = rawPhone.replace(/[\s\-\.\(\)\u200E\u200F]/g, '');

  let nationalDigits = '';

  if (clean.startsWith('+212')) {
    nationalDigits = clean.slice(4);
  } else if (clean.startsWith('00212')) {
    nationalDigits = clean.slice(5);
  } else if (clean.startsWith('212') && (clean.length === 11 || clean.length === 12 || clean.length === 13)) {
    nationalDigits = clean.slice(3);
  } else if (clean.startsWith('0')) {
    nationalDigits = clean.slice(1);
  } else if (/^[567]\d{8}$/.test(clean)) {
    nationalDigits = clean;
  } else {
    return {
      isValid: false,
      cleanPhone: clean,
      intlPhone: '',
      waPhone: '',
      type: 'unknown',
      error: 'Format de téléphone marocain invalide (doit commencer par 05, 06, 07 ou +212)',
    };
  }

  // Strip redundant trunk zero after international prefix (e.g. +212 06... -> 06...)
  if (nationalDigits.startsWith('0')) {
    nationalDigits = nationalDigits.slice(1);
  }

  // Moroccan numbers have exactly 9 digits after country code or leading 0
  if (!/^[567]\d{8}$/.test(nationalDigits)) {
    return {
      isValid: false,
      cleanPhone: clean,
      intlPhone: '',
      waPhone: '',
      type: 'unknown',
      error: 'Numéro marocain incomplet ou invalide (9 chiffres requis)',
    };
  }

  const firstDigit = nationalDigits[0];
  const type: 'mobile' | 'landline' = firstDigit === '5' ? 'landline' : 'mobile';

  return {
    isValid: true,
    cleanPhone: `0${nationalDigits}`,
    intlPhone: `+212${nationalDigits}`,
    waPhone: `212${nationalDigits}`,
    type,
  };
}
