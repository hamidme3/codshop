import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WHEEL_PRIZES = [
  { id: 'prize_1', label: '100 DH Crédit Publicitaire TikTok', type: 'ad_credit', value: 100, color: '#f43f5e' },
  { id: 'prize_2', label: 'Livraison Gratuite 5 Colis Ozon', type: 'shipping_credit', value: 125, color: '#059669' },
  { id: 'prize_3', label: '-50% sur l’Abonnement Scale', type: 'discount_subscription', value: 50, color: '#2563eb' },
  { id: 'prize_4', label: 'Audit Gratuit Tunnel COD par un Expert', type: 'coaching', value: 500, color: '#c59b27' },
  { id: 'prize_5', label: 'Badge Marchand Vérifié VIP', type: 'badge', value: 0, color: '#8b5cf6' },
  { id: 'prize_6', label: 'Pack 5 Thèmes Premium Débloqués', type: 'themes', value: 250, color: '#d97706' },
];

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Pick random prize with weighted probability
    const selectedIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[selectedIndex];

    return NextResponse.json({
      success: true,
      prizeIndex: selectedIndex,
      prize,
      message: `Félicitations ! Vous avez remporté : ${prize.label}`,
    });
  } catch (error: any) {
    console.error('[Spin Wheel Event POST] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du tirage de la roue' }, { status: 500 });
  }
}
