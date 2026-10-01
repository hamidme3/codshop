import type { PolicyType } from './types';
import { getCountryConfig } from './geo';

export interface StoreContext {
  storeName: string;
  storeSlug: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string; // Country code (e.g. 'MA', 'SA', 'AE', 'EG', 'SN', 'CI', 'FR', 'US', etc.)
  countryName?: string; // Localized country name or target market
  currency?: string; // Currency code (e.g. 'MAD', 'SAR', 'AED', 'USD', 'EUR', 'XOF', etc.)
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
 * Generates universal legal and operational policies for Cash-on-Delivery (COD) e-commerce stores.
 * Designed to be universal to all countries, markets, and currencies while adapting dynamically
 * to the store's configured country and operational context.
 * 
 * CORE RULES:
 * - UNIVERSAL: Not locked to any specific nation. Adapts dynamically to any country (Saudi Arabia,
 *   UAE, Egypt, Morocco, Senegal, Côte d'Ivoire, Europe, Americas, Worldwide).
 * - PERMANENT NO CARRIERS RULE: Strictly NO 3rd-party shipping carriers or courier aggregators (NO Ozon,
 *   SendIt, Cathedis, Amana, Aramex, DHL). Deliveries are managed directly by the merchant's dedicated
 *   delivery personnel and direct local dispatch team.
 * - CASH ON DELIVERY (COD) BEST PRACTICE: Emphasizes parcel inspection before payment guarantee
 *   ("Ouvrez et vérifiez votre colis avant de payer / عاين سلعتك وتأكد من الجودة قبل الدفع").
 * - DATA PRIVACY: Compliant with internationally recognized personal data protection standards.
 */
export function generateStandardPolicies(ctx: StoreContext): GeneratedPolicy[] {
  const name = ctx.storeName || 'Notre Boutique';
  const phone = ctx.phone || '+212 6 61 00 00 00';
  const email = ctx.email || 'contact@boutique.com';
  const city = ctx.city || 'Casablanca';
  const timeframe = ctx.deliveryTimeframe || '24h à 48h';
  const threshold = ctx.freeShippingThreshold || 400;

  // Resolve country config dynamically if country code is provided
  const countryCode = ctx.country ? ctx.country.trim().toUpperCase() : '';
  const countryConfig = countryCode && countryCode !== 'GLOBAL' && countryCode !== 'WORLDWIDE'
    ? getCountryConfig(countryCode)
    : null;

  const targetCountryName = ctx.countryName || (countryConfig ? countryConfig.name : '');
  const currency = ctx.currency || (countryConfig ? countryConfig.currency.code : 'MAD');

  // Universal territorial phrasing
  const territoryPhrase = targetCountryName
    ? `à destination de nos clients en ${targetCountryName}`
    : 'à destination de nos clients dans l’ensemble de nos zones de livraison';

  const territoryLocation = targetCountryName
    ? `${city}, ${targetCountryName}`
    : city;

  return [
    {
      title: 'Conditions Générales de Vente (CGV)',
      slug: 'terms',
      policyType: 'terms',
      seoTitle: `Conditions Générales de Vente | ${name}`,
      seoDescription: `Consultez les conditions générales de vente et de commande chez ${name}. Paiement à la livraison 100% sécurisé en espèces.`,
      content: `# Conditions Générales de Vente (CGV)

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

Bienvenue sur la boutique officielle de **${name}**. En passant commande sur notre boutique en ligne, vous acceptez sans réserve les présentes conditions générales de vente et d'utilisation.

---

### 1. Objet & Champ d'Application
Les présentes conditions régissent toutes les ventes de produits conclues sur la boutique **${name}** ${territoryPhrase}. Elles définissent les droits et obligations contractuels entre **${name}** et l'acheteur, applicables à toute commande passée sur notre site.

### 2. Tarifs & Devise
- Tous les prix indiqués sur notre boutique sont affichés en **${currency}**, toutes taxes applicables comprises.
- **${name}** se réserve le droit de modifier ses prix à tout moment. Les articles commandés sont systématiquement facturés sur la base des tarifs affichés au moment de la validation de votre commande.

### 3. Processus de Commande & Confirmation
1. **Passation de commande :** Le client sélectionne ses articles, précise la quantité souhaitée et renseigne ses coordonnées complètes (nom, numéro de téléphone joignable, ville et adresse de livraison).
2. **Confirmation téléphonique ou par message :** Afin de garantir l'authenticité de chaque commande et d'éviter tout retard, notre équipe de relation client prend contact avec le destinataire par appel téléphonique ou message direct pour confirmer la commande avant l'expédition.
3. **Engagement :** Toute commande confirmée auprès de notre service client constitue un engagement d'achat ferme.

### 4. Modalités de Règlement (Paiement à la Livraison - Cash on Delivery)
- Le règlement de vos achats s'effectue **exclusivement en espèces à la livraison (Cash on Delivery)**, directement remis à notre livreur lors de la réception du colis.
- Aucun paiement par carte bancaire en ligne n'est exigé sur ce site, garantissant une sérénité et une sécurité totale pour tous nos clients.

### 5. Service Client & Coordonnées
Pour toute question, suivi de commande ou réclamation, notre équipe est à votre entière disposition :
- **Téléphone / Assistance Directe :** ${phone}
- **Email :** ${email}
- **Centre d'opérations :** ${territoryLocation}
`,
    },
    {
      title: 'Politique de Confidentialité',
      slug: 'privacy',
      policyType: 'privacy',
      seoTitle: `Politique de Confidentialité | ${name}`,
      seoDescription: `Protection de vos données personnelles et respect de votre vie privée chez ${name}. Aucune coordonnée bancaire stockée.`,
      content: `# Politique de Confidentialité & Protection des Données Personnelles

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

Chez **${name}**, la protection de votre vie privée et de vos données personnelles constitue un engagement fondamental. Nous appliquons des principes stricts de confidentialité conformément aux meilleures normes internationales de protection des données et aux réglementations applicables en matière de commerce électronique.

---

### 1. Données Personnelles Collectées
Dans le cadre strict du traitement et de l'acheminement de votre commande, nous collectons uniquement les informations indispensables à la bonne exécution du service :
- **Nom et Prénom** : pour l'identification du destinataire du colis.
- **Numéro de téléphone** : pour la confirmation de commande et la coordination logistique du rendez-vous de livraison.
- **Ville et Adresse de livraison** : pour l'acheminement précis du colis à votre domicile ou bureau.

> **Garantie Sécurité Financière :** Notre boutique fonctionnant à 100% sur le modèle du Paiement à la Livraison (Cash on Delivery), nous ne collectons, ne traitons et ne conservons **aucune coordonnée bancaire** (numéro de carte de crédit, cryptogramme visuel, informations de compte).

### 2. Finalité du Traitement des Données
Vos données sont exploitées exclusivement pour :
- Valider et préparer votre commande.
- Coordonner la livraison de vos articles par notre équipe de livraison dédiée.
- Assurer le suivi du service après-vente et le traitement d'éventuelles demandes d'échange.

### 3. Confidentialité & Non-Transmission à des Tiers
**${name}** s'engage formellement à ne jamais vendre, louer, céder ou commercialiser vos informations personnelles auprès d'agences de publicité ou d'entreprises tierces. Vos données restent strictement confidentielles au sein de notre boutique.

### 4. Vos Droits d'Accès et de Rectification
Conformément aux standards de protection des données personnelles, vous disposez d'un droit permanent d'accès, de mise à jour, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment en contactant notre délégué à la protection des données :
- **Email :** ${email}
- **Service Client :** ${phone}
`,
    },
    {
      title: 'Livraison & Inspection du Colis',
      slug: 'shipping-policy',
      policyType: 'shipping',
      seoTitle: `Livraison Rapide & Garantie Inspection | ${name}`,
      seoDescription: `Livraison rapide en ${timeframe}. Inspection de votre colis autorisée avant paiement chez ${name}.`,
      content: `# Politique de Livraison & Garantie Inspection

Chez **${name}**, nous nous engageons à vous offrir un service de livraison rapide, fiable et transparent${territoryPhrase ? ` ${territoryPhrase}` : ''}, axé sur la confiance mutuelle.

---

### 1. Délais d'Acheminement
- **Délai moyen de livraison :** Vos commandes sont préparées et livrées sous un délai de **${timeframe}** à compter de la confirmation téléphonique de votre commande.
- **Prise de rendez-vous préalable :** Notre livreur vous contacte directement par téléphone le jour même de la livraison afin de convenir du créneau horaire et du lieu exact de remise en main propre.

### 2. Frais d'Expédition
- **Livraison Gratuite :** La livraison est entièrement offerte pour toute commande atteignant ou dépassant le montant de **${threshold} ${currency}**.
- **Tarifs standards :** Pour les commandes n'atteignant pas le seuil de gratuité, les frais d'expédition sont indiqués en toute clarté lors de la validation du panier.

### 3. Règle d'Or : Garantie Inspection Avant Paiement
Pour garantir une entière satisfaction et éliminer toute incertitude lors de vos achats en ligne :

> **⭐ Droit d'Inspection Garanti :** Vous disposez du plein droit d'ouvrir le colis en présence de notre livreur et d'examiner le produit (qualité, conformité, taille) avant de remettre le règlement en espèces.
> 
> * عاين سلعتك وتأكد من الجودة والمقاس قبل الدفع .*

### 4. Équipe de Livraison Directe
Toutes nos livraisons sont opérées et coordonnées directement par notre réseau de livreurs professionnels afin de vous garantir un transport soigné et un contact courtois.

Pour toute question relative à votre livraison ou pour convenir d'un changement d'adresse, contactez notre équipe au **${phone}**.
`,
    },
    {
      title: 'Retours & Échanges',
      slug: 'returns',
      policyType: 'returns',
      seoTitle: `Politique de Retours & Échanges | ${name}`,
      seoDescription: `Échanges simples et rapides sous 7 jours chez ${name}. Service client réactif et accompagnement direct.`,
      content: `# Politique de Retours & Échanges

Votre entière satisfaction est au cœur de nos priorités. Si un article reçu ne correspond pas parfaitement à vos attentes (taille, couleur ou modèle), nous vous accompagnons pour procéder à son échange dans les meilleures conditions.

---

### 1. Délai d'Échange (Garantie Sérénité)
Vous disposez d'un délai de **7 jours** calendaires à compter de la date de réception de votre colis pour demander un échange d'article.

### 2. Conditions d'Acceptation des Retours
Afin d'être éligible à un échange :
- L'article doit être **neuf, non utilisé, non porté et non lavé**.
- Le produit doit être restitué dans son emballage d'origine, accompagné de toutes ses étiquettes et accessoires d'origine.
- La référence ou le bon de livraison fourni lors de la réception doit être présenté.

### 3. Modalités d'Échange
1. **Notification :** Contactez notre service client au **${phone}** ou par email à **${email}** en indiquant votre référence de commande et le motif de votre demande.
2. **Traitement express :** Notre équipe valide votre demande dans un délai moyen de 24 heures ouvrées.
3. **Livraison de l'échange :** Notre livreur se présente à votre adresse pour vous remettre le nouvel article souhaité et reprendre l'article d'origine.

### 4. Article Non Conforme ou Défectueux
En cas d'erreur de préparation de commande ou de produit présentant une anomalie, les frais liés au remplacement sont intégralement pris en charge par **${name}**.
`,
    },
    {
      title: 'À Propos de Notre Boutique',
      slug: 'about-us',
      policyType: 'about',
      seoTitle: `À Propos de ${name} | Notre Vision & Engagements`,
      seoDescription: `Découvrez l'histoire de ${name}, nos engagements d'excellence, notre sélection de produits et notre service client.`,
      content: `# À Propos de ${name}

Bienvenue dans l'univers de **${name}**. Guidés par une passion sincère pour la qualité, nous nous donnons pour mission de proposer une sélection soignée d'articles répondant aux plus hauts standards d'exigence et de durabilité.

---

### Nos Engagements Fondamentaux
- **Qualité & Authenticité :** Chaque produit proposé dans notre catalogue fait l'objet d'une sélection minutieuse et d'un contrôle rigoureux avant d'être expédié.
- **Confiance & Transparence (Paiement COD) :** Nous croyons au commerce de proximité fondé sur la confiance. C'est pourquoi nous privilégions le paiement en espèces à la livraison avec autorisation d'inspection de votre colis.
- **Service Client Attentionné :** Notre équipe est disponible pour vous conseiller, répondre à vos questions et vous accompagner avant, pendant et après chaque commande.

### Coordonnées Officielles
- **Enseigne :** ${name}
- **Centre d'opérations :** ${territoryLocation}
- **Service Client :** ${phone}
- **Email :** ${email}
`,
    },
  ];
}
