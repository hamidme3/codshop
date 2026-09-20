'use client';

import React from 'react';
import { Crown, ShoppingBag, UserPlus, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Customer } from '@/lib/types';

export type CustomerSegment = 'vip' | 'regular' | 'new' | 'risk';

export function deriveCustomerSegment(customer: Partial<Customer>): CustomerSegment {
  const delivered = customer.deliveredOrders ?? 0;
  const returned = customer.returnedOrders ?? 0;
  const total = customer.totalOrders ?? 0;
  const spend = customer.totalSpend ?? 0;

  // High-Risk No-Show check
  if (returned >= 1 || customer.status === 'risk') {
    return 'risk';
  }

  // VIP Loyalist check
  if (delivered >= 3 || spend >= 1500) {
    return 'vip';
  }

  // Regular repeat buyer check
  if (delivered >= 2 || total >= 2) {
    return 'regular';
  }

  // New first-timer
  return 'new';
}

interface CustomerRiskBadgeProps {
  segment?: CustomerSegment;
  customer?: Partial<Customer>;
  showDescription?: boolean;
}

export default function CustomerRiskBadge({ 
  segment, 
  customer,
  showDescription = false 
}: CustomerRiskBadgeProps) {
  const resolvedSegment = segment || (customer ? deriveCustomerSegment(customer) : 'new');

  switch (resolvedSegment) {
    case 'vip':
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono tracking-tight"
          title="Client VIP : 3+ livraisons réussies sans retour. Éligible confirmation automatique."
        >
          <Crown className="w-3 h-3 text-purple-400 fill-purple-400/30 shrink-0" />
          VIP Fidèle
          {showDescription && <span className="text-[10px] text-purple-400 font-normal ml-1">(-15% Auto)</span>}
        </span>
      );

    case 'regular':
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono tracking-tight"
          title="Acheteur Récurrent : Confiance établie avec livraisons préalables."
        >
          <ShoppingBag className="w-3 h-3 text-blue-400 shrink-0" />
          Régulier
          {showDescription && <span className="text-[10px] text-blue-400 font-normal ml-1">(2+ Achats)</span>}
        </span>
      );

    case 'risk':
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/40 font-mono tracking-tight animate-pulse"
          title="Alerte Risque : Antécédent de refus ou colis retourné. Acompte ou double confirmation requise."
        >
          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
          Client à Risque
          {showDescription && <span className="text-[10px] text-rose-400 font-normal ml-1">(Acompte Requis)</span>}
        </span>
      );

    case 'new':
    default:
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono tracking-tight"
          title="Nouveau Client : Première commande. Nécessite confirmation téléphonique rapide."
        >
          <UserPlus className="w-3 h-3 text-zinc-400 shrink-0" />
          Nouveau
          {showDescription && <span className="text-[10px] text-zinc-400 font-normal ml-1">(1er Achat)</span>}
        </span>
      );
  }
}
