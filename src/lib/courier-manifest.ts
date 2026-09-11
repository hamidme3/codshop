/**
 * Courier Export Manifest Engine for Moroccan Logistics
 * Supports: Ozon Express, SendIt, Cathedis, Amana Express (Poste Maroc)
 * and Universal Printable "Bon de Ramassage" (Pickup Sheet).
 */

import { Order } from './types';
import { formatOrderItemsSummary } from './whatsapp-templates';
import { escapeHtml } from './sanitizer';

export type ShippingCourier = 'ozon' | 'sendit' | 'cathedis' | 'amana' | 'manual';
export type CourierKey = 'standard' | ShippingCourier;

export interface ManifestExportResult {
  courier: CourierKey;
  filename: string;
  mimeType: string;
  content: string; // CSV content
  orderCount: number;
  totalCrbt: number;
}

/** Helper to escape CSV cell fields (handles semicolons, quotes, newlines) */
function escapeCsv(value: string | number | undefined | null, delimiter = ';'): string {
  if (value === undefined || value === null) return '';
  const str = String(value).trim();
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Clean phone number for courier systems (e.g. 06XXXXXXXX or 07XXXXXXXX) */
function formatCourierPhone(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('212') && digits.length === 12) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith('00212') && digits.length === 14) {
    digits = `0${digits.slice(5)}`;
  }
  return digits;
}

// ── 1. Ozon Express Manifest ──────────────────────────────────────────
export function generateOzonManifest(orders: Order[], storeName = 'Boutique'): ManifestExportResult {
  const delimiter = ';';
  const headers = [
    'Destinataire',
    'Telephone',
    'Ville',
    'Adresse',
    'Prix_CRBT',
    'Designation',
    'Code_Envoi_Ref',
    'Ouvrir_Colis',
    'Echange',
  ];

  const rows = orders.map((o) => [
    escapeCsv(o.customerName, delimiter),
    escapeCsv(formatCourierPhone(o.phone), delimiter),
    escapeCsv(o.city, delimiter),
    escapeCsv(o.address, delimiter),
    escapeCsv(o.total, delimiter),
    escapeCsv(formatOrderItemsSummary(o), delimiter),
    escapeCsv(o.orderNumber, delimiter),
    escapeCsv('OUI', delimiter), // Standard practice: customers demand opening in Morocco
    escapeCsv('NON', delimiter),
  ]);

  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    courier: 'ozon',
    filename: `ozon_manifest_${storeName.toLowerCase()}_${dateStr}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: csvContent,
    orderCount: orders.length,
    totalCrbt,
  };
}

// ── 2. SendIt Express Manifest ────────────────────────────────────────
export function generateSenditManifest(orders: Order[], storeName = 'Boutique'): ManifestExportResult {
  const delimiter = ';';
  const headers = [
    'Ref_Commande',
    'Nom_Client',
    'Telephone_1',
    'Telephone_2',
    'Ville_Destination',
    'Adresse_Complete',
    'Montant_COD_DH',
    'Description_Marchandise',
    'Remarque_Livreur',
  ];

  const rows = orders.map((o) => [
    escapeCsv(o.orderNumber, delimiter),
    escapeCsv(o.customerName, delimiter),
    escapeCsv(formatCourierPhone(o.phone), delimiter),
    escapeCsv('', delimiter),
    escapeCsv(o.city, delimiter),
    escapeCsv(o.address, delimiter),
    escapeCsv(o.total, delimiter),
    escapeCsv(formatOrderItemsSummary(o), delimiter),
    escapeCsv(o.agentNotes || 'Appeler avant livraison', delimiter),
  ]);

  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    courier: 'sendit',
    filename: `sendit_manifest_${storeName.toLowerCase()}_${dateStr}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: csvContent,
    orderCount: orders.length,
    totalCrbt,
  };
}

// ── 3. Cathedis Manifest ──────────────────────────────────────────────
export function generateCathedisManifest(orders: Order[], storeName = 'Boutique'): ManifestExportResult {
  const delimiter = ';';
  const headers = [
    'Reference',
    'Destinataire',
    'Telephone',
    'Ville',
    'Adresse',
    'Montant',
    'Libelle_Colis',
    'Nbre_Pieces',
    'Fragile',
  ];

  const rows = orders.map((o) => {
    const totalQty = o.items.reduce((q, it) => q + (it.quantity || 1), 0);
    return [
      escapeCsv(o.orderNumber, delimiter),
      escapeCsv(o.customerName, delimiter),
      escapeCsv(formatCourierPhone(o.phone), delimiter),
      escapeCsv(o.city, delimiter),
      escapeCsv(o.address, delimiter),
      escapeCsv(o.total, delimiter),
      escapeCsv(formatOrderItemsSummary(o), delimiter),
      escapeCsv(totalQty, delimiter),
      escapeCsv('NON', delimiter),
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    courier: 'cathedis',
    filename: `cathedis_manifest_${storeName.toLowerCase()}_${dateStr}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: csvContent,
    orderCount: orders.length,
    totalCrbt,
  };
}

// ── 4. Amana Express (Poste Maroc) Manifest ───────────────────────────
export function generateAmanaManifest(orders: Order[], storeName = 'Boutique'): ManifestExportResult {
  const delimiter = ';';
  const headers = [
    'Numero_Depot',
    'Destinataire',
    'Telephone',
    'Ville',
    'Adresse',
    'Montant_CRBT',
    'Designation',
    'Mode_Paiement',
  ];

  const rows = orders.map((o) => [
    escapeCsv(o.orderNumber, delimiter),
    escapeCsv(o.customerName, delimiter),
    escapeCsv(formatCourierPhone(o.phone), delimiter),
    escapeCsv(o.city, delimiter),
    escapeCsv(o.address, delimiter),
    escapeCsv(o.total, delimiter),
    escapeCsv(formatOrderItemsSummary(o), delimiter),
    escapeCsv('ESPECES', delimiter),
  ]);

  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    courier: 'amana',
    filename: `amana_manifest_${storeName.toLowerCase()}_${dateStr}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: csvContent,
    orderCount: orders.length,
    totalCrbt,
  };
}

// ── 0. Universal Standard COD Manifest (Excel / Sheets / Aggregators) ──
export function generateStandardCodManifest(orders: Order[], storeName = 'Boutique'): ManifestExportResult {
  const delimiter = ';';
  const headers = [
    'N_Commande',
    'Date_Commande',
    'Client',
    'Telephone',
    'Ville',
    'Mode_Livraison',
    'Adresse_Complete',
    'Point_Relais_Agence',
    'Articles_Commandes',
    'Sous_Total_DH',
    'Frais_Livraison_DH',
    'Total_COD_DH',
    'Statut',
    'Transporteur',
    'Numero_Suivi',
    'Source',
    'Variante_AB',
  ];

  const rows = orders.map((o) => [
    escapeCsv(o.orderNumber, delimiter),
    escapeCsv(o.createdAt ? new Date(o.createdAt).toLocaleString('fr-FR') : '', delimiter),
    escapeCsv(o.customerName, delimiter),
    escapeCsv(formatCourierPhone(o.phone), delimiter),
    escapeCsv(o.city, delimiter),
    escapeCsv(o.deliveryType === 'stopdesk' ? 'Point Relais (Stopdesk)' : 'Livraison à Domicile', delimiter),
    escapeCsv(o.address, delimiter),
    escapeCsv(o.agencyName || (o.deliveryType === 'stopdesk' ? 'Agence la plus proche' : '-'), delimiter),
    escapeCsv(formatOrderItemsSummary(o), delimiter),
    escapeCsv(o.subtotal, delimiter),
    escapeCsv(o.shippingFee, delimiter),
    escapeCsv(o.total, delimiter),
    escapeCsv(o.status, delimiter),
    escapeCsv(o.courier || 'ozon', delimiter),
    escapeCsv(o.trackingNumber || '-', delimiter),
    escapeCsv(o.source || 'web', delimiter),
    escapeCsv(o.abVariant || 'control', delimiter),
  ]);

  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    courier: 'standard',
    filename: `cod_orders_${storeName.toLowerCase()}_${dateStr}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: csvContent,
    orderCount: orders.length,
    totalCrbt,
  };
}

// ── Universal Dispatcher ──────────────────────────────────────────────
export function exportCourierManifest(
  courier: CourierKey,
  orders: Order[],
  storeName = 'Boutique'
): ManifestExportResult {
  switch (courier) {
    case 'standard':
      return generateStandardCodManifest(orders, storeName);
    case 'ozon':
      return generateOzonManifest(orders, storeName);
    case 'sendit':
      return generateSenditManifest(orders, storeName);
    case 'cathedis':
      return generateCathedisManifest(orders, storeName);
    case 'amana':
      return generateAmanaManifest(orders, storeName);
    default:
      return generateStandardCodManifest(orders, storeName);
  }
}

// ── 5. Printable Bon de Ramassage (A4 Pickup Sheet) ───────────────────
export function generateBonDeRamassageHtml(
  manifestId: string,
  orders: Order[],
  storeName: string,
  courierName: string
): string {
  const dateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Bon de Ramassage - ${manifestId}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { margin: 12mm; size: A4 portrait; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 24px;
      font-size: 11px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand { font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .title { font-size: 16px; font-weight: 800; color: #d97706; }
    .badge {
      display: inline-block;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      margin-top: 4px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .stat-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .stat-val { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
    }
    tr:nth-child(even) { background: #f8fafc; }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .sig-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 8px;
      padding: 12px;
      height: 110px;
    }
    .sig-title { font-weight: 800; font-size: 11px; margin-bottom: 4px; }
    .sig-hint { font-size: 9px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${escapeHtml(storeName)}</div>
      <div class="title">Bordereau de Ramassage & Décharge Transporteur</div>
      <div style="color: #64748b; margin-top: 2px;">Date: ${dateFormatted}</div>
    </div>
    <div style="text-align: right;">
      <div class="badge">N° MANIFESTE: ${escapeHtml(manifestId)}</div>
      <div style="margin-top: 4px; font-weight: 700; color: #0284c7;">Transporteur: ${escapeHtml(courierName.toUpperCase())}</div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Colis</div>
      <div class="stat-val">${orders.length} colis</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Valeur COD (CRBT Total)</div>
      <div class="stat-val" style="color: #059669;">${totalCrbt.toLocaleString('fr-FR')} DH</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Expéditeur</div>
      <div class="stat-val">${escapeHtml(storeName)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Mode d'encaissement</div>
      <div class="stat-val">Espèces (COD)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th>N° Commande</th>
        <th>Destinataire</th>
        <th>Téléphone</th>
        <th>Ville</th>
        <th>Articles</th>
        <th>Montant COD</th>
        <th>N° Suivi / Barcode</th>
        <th style="width: 60px;">Contrôle</th>
      </tr>
    </thead>
    <tbody>
      ${orders
        .map(
          (o, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${escapeHtml(o.orderNumber)}</strong></td>
          <td>${escapeHtml(o.customerName)}</td>
          <td>${escapeHtml(formatCourierPhone(o.phone))}</td>
          <td><strong>${escapeHtml(o.city)}</strong></td>
          <td>${escapeHtml(formatOrderItemsSummary(o))}</td>
          <td style="font-weight: 800; color: #0f172a;">${o.total} DH</td>
          <td style="font-family: monospace;">${escapeHtml(o.trackingNumber || '-')}</td>
          <td style="text-align: center;">[ &nbsp; ]</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-box">
      <div class="sig-title">Pour l'Expéditeur (${storeName})</div>
      <div class="sig-hint">Certification de conformité des colis remis au chauffeur :</div>
    </div>
    <div class="sig-box">
      <div class="sig-title">Accusé de Réception Transporteur (${courierName})</div>
      <div class="sig-hint">Nom du livreur / chauffeur, N° CIN, Immatriculation & Signature :</div>
    </div>
  </div>
</body>
</html>`;
}
