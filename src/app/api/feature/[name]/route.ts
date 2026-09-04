import { NextResponse } from 'next/server';

const ACTIVE_FEATURES: Record<string, { enabled: boolean; description: string; tier: string }> = {
  cod_checkout: { enabled: true, description: 'Moroccan COD Fast Checkout Engine', tier: 'starter' },
  otp_sms: { enabled: true, description: 'Moroccan Phone Number SMS OTP Login', tier: 'starter' },
  totp_2fa: { enabled: true, description: 'RFC 6238 TOTP Two-Factor Authentication', tier: 'starter' },
  kyc_compliance: { enabled: true, description: 'Moroccan Legal Compliance (ICE, CNI, RIB)', tier: 'starter' },
  ads_pixel_hub: { enabled: true, description: 'Multi-Platform Ad Tracking & Pinterest Doubler', tier: 'starter' },
  support_concierge: { enabled: true, description: 'Internal Ticketing & WhatsApp VIP Desk', tier: 'starter' },
  custom_domains: { enabled: true, description: 'Custom Domains with SSL Edge Proxy', tier: 'pro' },
  gamification_milestones: { enabled: true, description: '5-Tier Revenue Milestones ($1K-$10M)', tier: 'starter' },
  multi_tenancy: { enabled: true, description: 'Multi-Store Switching & Consolidated Analytics', tier: 'starter' },
  youcan_pay: { enabled: false, description: 'YouCan Pay Proprietary Gateway (Excluded)', tier: 'enterprise' },
  youcan_ship: { enabled: false, description: 'YouCan Ship Aggregator (Excluded)', tier: 'enterprise' },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const key = name.toLowerCase().replace(/-/g, '_');
    const feature = ACTIVE_FEATURES[key];

    if (!feature) {
      return NextResponse.json({
        name,
        enabled: false,
        description: 'Unknown feature flag',
        tier: 'unspecified',
      });
    }

    return NextResponse.json({
      name,
      ...feature,
    });
  } catch (error: any) {
    console.error('[Feature Flag API] Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate feature flag' }, { status: 500 });
  }
}
