'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import {
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileText,
  Clock,
  MessageCircle,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { StorePage } from '@/lib/types';

export default function StorefrontCustomPage() {
  const params = useParams();
  const router = useRouter();
  const pageSlug = (params?.slug as string) || '';
  const { theme, storeSlug } = useTheme();

  const [page, setPage] = useState<StorePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageSlug) return;
    setLoading(true);
    setError(null);

    const activeSlug = storeSlug || 'ottavio';
    fetch(`/api/stores/${encodeURIComponent(activeSlug)}/pages/${encodeURIComponent(pageSlug)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Page introuvable');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.page) {
          if (!data.page.isPublished) {
            throw new Error('Cette page est actuellement en cours de rédaction.');
          }
          setPage(data.page);
        } else {
          throw new Error('Impossible de charger la page');
        }
      })
      .catch((err) => {
        setError(err.message || 'Page introuvable');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageSlug, storeSlug]);

  // Markdown-like simple renderer for paragraphs, headings, bullet lists, blockquotes, and bold text
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];

    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1.5 my-3 pl-1 text-sm leading-relaxed">
            {listBuffer.map((item, idx) => (
              <li key={idx} className="text-sm">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const renderInlineMarkdown = (text: string) => {
      // Bold **text**
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-zinc-900 dark:text-zinc-100" style={{ color: 'var(--theme-text-primary)' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Heading 1
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1
            key={idx}
            className="text-2xl sm:text-3xl font-black mt-6 mb-4 tracking-tight"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            {trimmed.replace('# ', '')}
          </h1>
        );
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2
            key={idx}
            className="text-xl sm:text-2xl font-bold mt-6 mb-3 tracking-tight border-b pb-2"
            style={{ color: 'var(--theme-text-primary)', borderColor: 'var(--theme-border)' }}
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3
            key={idx}
            className="text-base sm:text-lg font-bold mt-5 mb-2"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal separator
      if (trimmed === '---') {
        flushList();
        elements.push(
          <hr
            key={idx}
            className="my-6 border-t"
            style={{ borderColor: 'var(--theme-border)' }}
          />
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <div
            key={idx}
            className="p-4 rounded-xl border my-4 text-xs sm:text-sm leading-relaxed"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              borderColor: 'rgba(16, 185, 129, 0.25)',
              color: 'var(--theme-text-primary)',
            }}
          >
            {renderInlineMarkdown(trimmed.replace('> ', ''))}
          </div>
        );
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listBuffer.push(trimmed.slice(2));
        return;
      }

      // Regular paragraph or empty line
      flushList();
      if (trimmed) {
        elements.push(
          <p
            key={idx}
            className="text-sm leading-relaxed my-2.5"
            style={{ color: 'var(--theme-text-secondary, #a1a1aa)' }}
          >
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const getPolicyIcon = (policyType: string) => {
    switch (policyType) {
      case 'shipping':
        return <Truck className="w-5 h-5 text-emerald-500" />;
      case 'returns':
        return <RotateCcw className="w-5 h-5 text-amber-500" />;
      case 'privacy':
      case 'terms':
        return <ShieldCheck className="w-5 h-5 text-sky-500" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-semibold text-zinc-400">Chargement de la page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] max-w-lg mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Page Non Trouvée</h1>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          {error || 'La page que vous recherchez n’existe pas ou a été déplacée par la boutique.'}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-200 transition"
          >
            Retour à l’Accueil
          </Link>
          <Link
            href="/catalog"
            className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition"
          >
            Voir le Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
          <Link href="/" className="hover:underline flex items-center gap-1">
            <span>Accueil</span>
          </Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <Link href="/catalog" className="hover:underline">
            <span>Boutique</span>
          </Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="font-semibold truncate max-w-[200px]" style={{ color: 'var(--theme-text-primary)' }}>
            {page.title}
          </span>
        </nav>

        {/* Header Hero Banner */}
        <div
          className="rounded-2xl border p-6 sm:p-8 space-y-4 shadow-xs"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                {getPolicyIcon(page.policyType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                    }}
                  >
                    {page.isSystemPolicy ? 'Document Officiel' : 'Information Boutique'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span>Mise à jour le {new Date(page.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-black mt-1 tracking-tight"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  {page.title}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition hover:opacity-80"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)',
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
          </div>
        </div>

        {/* Moroccan Parcel Inspection Guarantee Banner (Special Callout on Shipping/Return/CGV) */}
        {['shipping', 'returns', 'terms'].includes(page.policyType) && (
          <div
            className="rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Garantie Sérénité Maroc : Ouvrez et vérifiez votre colis</span>
                  <span className="text-[11px] font-normal text-emerald-400 font-arabic">عاين سلعتك قبل ما تخلص</span>
                </h3>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Paiement 100% à la livraison (Cash on Delivery). Vous ne réglez le livreur qu’après avoir vérifié la conformité de vos articles.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950">
              100% Protégé
            </span>
          </div>
        )}

        {/* Main Document Content */}
        <div
          className="rounded-2xl border p-6 sm:p-10 shadow-xs"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="prose prose-invert max-w-none">
            {renderFormattedContent(page.content)}
          </div>
        </div>

        {/* Bottom Support Callout */}
        <div
          className="rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--theme-text-primary)' }}>
              Une question concernant cette politique ?
            </h4>
            <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              Notre équipe est joignable 7j/7 pour vous assister et répondre à toutes vos interrogations.
            </p>
          </div>

          <a
            href="https://wa.me/212661000000?text=Salam,%20j%27ai%20une%20question%20sur%20vos%20politiques%20de%20boutique"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Assistance WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
