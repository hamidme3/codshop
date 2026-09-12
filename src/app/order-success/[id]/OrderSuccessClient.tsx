'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PhoneCall, Truck, Banknote, MessageCircle, ArrowLeft, User, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { fetchAndInitPixels, trackPurchase } from '@/lib/pixel-tracker';

interface OrderSuccessClientProps {
  orderId: string;
  customerName: string;
  city: string;
  total: number | null;
  items?: { id?: string; title: string; quantity: number; price: number; variant?: string }[];
}

export default function OrderSuccessClient({
  orderId,
  customerName,
  city,
  total,
  items = [],
}: OrderSuccessClientProps) {
  const { formatMAD } = useTheme();

  useEffect(() => {
    // Launch festive Moroccan order celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#d97706', '#2563eb', '#dc2626'],
      });
    } catch {
      // ignore
    }

    // Initialize pixels and fire deduplicated Purchase event
    fetchAndInitPixels().then(() => {
      trackPurchase({
        orderId,
        total: total || 0,
        items,
        customerCity: city,
      });
    });
  }, [orderId, total, items, city]);

  const whatsAppUrl = `https://wa.me/212661000000?text=${encodeURIComponent(
    `Salam, je confirme ma commande #${orderId} au nom de ${customerName} (${city}${total ? `, Total: ${total} DH` : ''})`
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          Commande Enregistrée avec Succès
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Merci {customerName} pour votre confiance !
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
          Votre commande <span className="font-mono font-bold text-zinc-900">#{orderId}</span> au nom de <span className="font-semibold text-zinc-900">{customerName}</span> a bien été enregistrée et transmise à notre équipe de préparation.
        </p>
      </div>

      {/* Recap Box */}
      <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left space-y-3">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Client :</span>
          </span>
          <span className="font-bold text-zinc-900">{customerName}</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500">Numéro de Commande :</span>
          <span className="font-mono font-bold text-zinc-900">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>Destination :</span>
          </span>
          <span className="font-bold text-zinc-900">{city}</span>
        </div>
        {items && items.length > 0 && (
          <div className="text-xs pb-3 border-b border-zinc-100 space-y-1">
            <span className="text-zinc-500">Articles commandés :</span>
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-zinc-800">
                <span>{it.quantity}x {it.title}</span>
                <span className="font-semibold">{formatMAD(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        )}
        {total !== null && (
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span className="text-zinc-900">Montant à régler à la livraison :</span>
            <span className="text-base font-black text-emerald-700">{formatMAD(total)}</span>
          </div>
        )}
      </div>

      {/* 3 Steps Timeline */}
      <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-left space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
          Ce qui va se passer maintenant :
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Appel de confirmation téléphonique</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Notre agent va vous appeler dans les prochaines heures pour confirmer votre adresse à {city} et convenir de l'horaire de livraison.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Expédition express sous 24h</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Votre colis est confié à notre transporteur partenaire (Ozon / SendIt) pour acheminement vers {city}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Réception & Paiement en espèces</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Vous vérifiez votre produit directement devant le livreur, puis réglez en dirhams en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Suivre ma commande sur WhatsApp</span>
        </a>

        <a
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retourner à la boutique</span>
        </a>
      </div>
    </div>
  );
}
