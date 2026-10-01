import type { PolicyType, StorePage } from './types';

export interface StoreContext {
  storeName: string;
  storeSlug: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  currency?: string;
  deliveryTimeframe?: string;
  freeShippingThreshold?: number;
}

export interface GeneratedPolicy {
  title: string;
  slug: string;
  policyType: PolicyType;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

/**
 * Generates standard legal and operational policies compliant with Moroccan e-commerce regulations
 * and Cash-on-Delivery (COD) best practices.
 * 
 * CORE RULES:
 * - NO 3rd-party carriers or courier aggregators (NO Ozon, SendIt, Cathedis, Amana). Deliveries are
 *   managed directly by the merchant's delivery staff.
 * - Strictly enforces Moroccan parcel inspection guarantee ("Vérifiez votre colis avant de payer").
 * - Moroccan Law 09-08 (CNDP) personal data protection compliance.
 */
export function generateStandardPolicies(ctx: StoreContext): GeneratedPolicy[] {
  const name = ctx.storeName || 'Notre Boutique';
  const phone = ctx.phone || '+212 6 61 00 00 00';
  const email = ctx.email || 'contact@boutique.ma';
  const city = ctx.city || 'Casablanca';
  const currency = ctx.currency || 'MAD';
  const timeframe = ctx.deliveryTimeframe || '24h à 48h';
  const threshold = ctx.freeShippingThreshold || 400;

  return [
    {
      title: 'Conditions Générales de Vente (CGV)',
      slug: 'terms',
      policyType: 'terms',
      seoTitle: `Conditions Générales de Vente | ${name}`,
      seoDescription: `Consultez les conditions générales de vente et de commande chez ${name}. Paiement à la livraison 100% sécurisé.`,
      content: `# Conditions Générales de Vente (CGV)

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

Bienvenue sur la boutique officielle de **${name}**. En passant commande sur notre boutique en ligne, vous acceptez sans réserve les présentes conditions générales de vente.

---

### 1. Objet & Champ d'Application
Les présentes conditions régissent toutes les ventes conclues sur la boutique **${name}** à destination des clients résidant au Maroc. Elles visent à définir les relations contractuelles entre ${name} et le client, ainsi que les conditions applicables à tout achat.

### 2. Prix & Devise
- Tous les prix affichés sur notre boutique sont exprimés en **${currency}** (Dirhams Marocains), toutes taxes comprises (TTC).
- ${name} se réserve le droit de modifier ses prix à tout moment. Toutefois, les produits seront facturés sur la base des tarifs en vigueur au moment de l'enregistrement de votre commande.

### 3. Processus de Commande & Confirmation
1. **Passation de commande :** Le client sélectionne ses articles, remplit ses coordonnées (nom, numéro de téléphone, ville et adresse de livraison).
2. **Validation téléphonique :** Pour garantir la sincérité de chaque commande, notre service client contacte systématiquement le client par téléphone ou via WhatsApp pour confirmer la commande avant toute expédition.
3. **Engagement :** Toute commande confirmée par téléphone constitue un engagement ferme de réception.

### 4. Modalités de Paiement (Paiement à la Livraison - COD)
- Le règlement s'effectue **exclusivement en espèces à la livraison (Cash on Delivery)** directement auprès de notre livreur.
- Aucun paiement par carte bancaire en ligne n'est exigé sur ce site, garantissant une sécurité totale pour nos clients.

### 5. Service Client & Réclamations
Pour toute question relative à une commande, notre service client est joignable :
- **Téléphone / WhatsApp :** ${phone}
- **Email :** ${email}
- **Ville du siège :** ${city}, Maroc
`,
    },
    {
      title: 'Politique de Confidentialité',
      slug: 'privacy',
      policyType: 'privacy',
      seoTitle: `Politique de Confidentialité | ${name}`,
      seoDescription: `Protection de vos données personnelles chez ${name}. Conformité stricte avec la loi marocaine 09-08 (CNDP).`,
      content: `# Politique de Confidentialité & Données Personnelles

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

Chez **${name}**, la protection de vos données personnelles est une priorité absolue. Nous nous engageons à respecter les dispositions de la **loi marocaine n° 09-08** relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP).

---

### 1. Données Collectées
Dans le cadre de votre commande sur notre boutique, nous collectons uniquement les informations strictement nécessaires à la bonne livraison de votre colis :
- **Nom et Prénom** : pour identifier le destinataire.
- **Numéro de téléphone** : pour la confirmation de commande et la coordination avec le livreur.
- **Ville et Adresse de livraison** : pour acheminer le colis à votre domicile ou lieu de travail.

> **Important :** Nous ne collectons, ne traitons et ne stockons **aucune coordonnée bancaire** (numéro de carte de crédit, CVV), le paiement s'effectuant intégralement en espèces lors de la réception du colis.

### 2. Finalité du Traitement
Vos données personnelles sont utilisées exclusivement pour :
- Confirmer les détails de votre commande par appel ou message WhatsApp.
- Assurer la livraison rapide de vos produits par notre équipe de livraison.
- Vous assister en cas de demande d'échange ou de service après-vente.

### 3. Non-Divulgation à des Tiers
${name} s'interdit formellement de vendre, louer, céder ou échanger vos données personnelles avec des tiers à des fins publicitaires ou de prospection commerciale.

### 4. Vos Droits (Loi 09-08)
Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Pour exercer ce droit, contactez-nous directement :
- **Email :** ${email}
- **WhatsApp :** ${phone}
`,
    },
    {
      title: 'Livraison & Inspection du Colis',
      slug: 'shipping-policy',
      policyType: 'shipping',
      seoTitle: `Politique de Livraison & Inspection | ${name}`,
      seoDescription: `Livraison rapide 24h-48h au Maroc. Garantie inspection du colis avant paiement chez ${name}.`,
      content: `# Politique de Livraison & Garantie Inspection

Chez **${name}**, nous mettons tout en œuvre pour vous offrir une expérience d'achat fluide, rapide et en toute confiance partout au Maroc.

---

### 1. Délais de Livraison
- **Délai standard :** Vos commandes sont livrées sous un délai de **${timeframe}** à compter de la confirmation téléphonique de votre commande.
- **Prise de rendez-vous :** Notre livreur dédié vous contacte directement par téléphone le jour de la livraison pour convenir de l'heure et du lieu exact de remise du colis.

### 2. Frais de Livraison
- **Livraison Gratuite :** La livraison est offerte pour toute commande supérieure ou égale à **${threshold} ${currency}**.
- **Tarifs standards :** Pour les commandes inférieures au montant seuil, les frais de livraison s'appliquent selon votre ville lors du passage de commande.

### 3. Garantie Sérénité : Inspection Avant Paiement
Pour votre sécurité et tranquillité d'esprit, nous appliquons la règle d'or du e-commerce de confiance :

> **⭐ Inspection Autorisée :** Vous avez le plein droit d'ouvrir le colis en présence de notre livreur et d'examiner le produit avant de remettre l'argent.
> 
> * عاين سلعتك وتأكد من الجودة والمقاس قبل ما تخلص .*

### 4. Gestion par Notre Équipe Directe
Toutes nos livraisons sont assurées et supervisées directement par notre réseau de livreurs professionnels afin de garantir un soin maximal de vos articles et une ponctualité irréprochable.

En cas de retard ou de besoin de modification d'adresse, prévenez immédiatement notre équipe support au **${phone}**.
`,
    },
    {
      title: 'Retours & Échanges',
      slug: 'returns',
      policyType: 'returns',
      seoTitle: `Retours & Échanges | ${name}`,
      seoDescription: `Politique de retour et d'échange sous 7 jours chez ${name}. Service client réactif sur WhatsApp.`,
      content: `# Politique de Retours & Échanges

Votre satisfaction est notre priorité. Si un produit ne répond pas entièrement à vos attentes, nous facilitons le processus d'échange.

---

### 1. Délai d'Échange (Garantie 7 Jours)
Vous disposez d'un délai légal de **7 jours calendaires** à compter de la date de réception de votre commande pour demander un échange (changement de taille, de couleur ou de modèle).

### 2. Conditions d'Éligibilité
Pour qu'un retour ou échange soit validé :
- L'article doit être **neuf, non porté, non lavé** et dans son état d'origine.
- Le produit doit être retourné avec son emballage et ses étiquettes d'origine intactes.
- La preuve d'achat ou le bon de livraison doit accompagner la demande.

### 3. Procédure Simple en 3 Étapes
1. **Contactez-nous :** Envoyez un message WhatsApp au **${phone}** en indiquant votre numéro de commande et le motif de l'échange (avec photos si nécessaire).
2. **Validation :** Notre service client valide votre demande en moins de 24h.
3. **Échange à domicile :** Notre livreur se déplace pour vous apporter le nouveau produit et récupérer l'ancien article.

### 4. Produit Défectueux ou Erreur de Commande
Si vous constatez un défaut de fabrication ou une non-conformité à la livraison, l'échange est pris en charge à 100% sans aucun frais supplémentaire.
`,
    },
    {
      title: 'À Propos de Notre Boutique',
      slug: 'about-us',
      policyType: 'about',
      seoTitle: `À Propos de ${name} | Histoire & Valeurs`,
      seoDescription: `Découvrez l'histoire de ${name}, nos engagements de qualité et notre passion pour l'excellence au Maroc.`,
      content: `# À Propos de ${name}

Bienvenue dans l'univers de **${name}**. Née d'une passion authentique pour la qualité, notre boutique s'est donné pour mission de proposer le meilleur des produits avec un service irréprochable pour nos clients à travers tout le Royaume du Maroc.

---

### Notre Engagement
- **Excellence & Authenticité :** Chaque article de notre catalogue est rigoureusement sélectionné, contrôlé et testé avant d'être proposé à la vente.
- **Confiance Totale (Paiement COD) :** Nous croyons en la transparence absolue. C'est pourquoi nous privilégions le paiement en espèces à la livraison avec autorisation d'inspection de vos colis.
- **Proximité & Écoute :** Une équipe marocaine dédiée à votre service, disponible tous les jours pour vous conseiller et vous accompagner.

### Nous Contacter
- **Boutique officielle :** ${name}
- **Centre d'opérations :** ${city}, Maroc
- **WhatsApp Direct :** ${phone}
- **Email :** ${email}
`,
    },
  ];
}
