import { pgTable, uuid, text, integer, timestamp, boolean, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ── Stores (Tenants) ───────────────────────────────────────────
export const stores = pgTable(
  'stores',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(), // e.g. "ottavio" -> ottavio.codshop.vipone.site
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    subdomain: text('subdomain').notNull().unique(),
    customDomain: text('custom_domain'), // e.g. "boutique.ma"
    currency: text('currency').default('MAD').notNull(),
    country: text('country').default('MA').notNull(), // 'MA' | 'SA' | 'AE' | 'EG' | 'DZ' | 'SN' | 'CI'
    planTier: text('plan_tier').default('starter').notNull(), // 'starter' | 'pro' | 'scale'
    isWaybillEnabled: boolean('is_waybill_enabled').default(false).notNull(), // A/B: "Bon de Livraison" waybill skin
    trialEndsAt: timestamp('trial_ends_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('store_slug_idx').on(table.slug),
    uniqueIndex('store_subdomain_idx').on(table.subdomain),
  ]
);

// ── Products ───────────────────────────────────────────────────
export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    title: text('title').notNull(),
    sku: text('sku').notNull(),
    category: text('category').notNull(),
    price: integer('price').notNull(), // Selling Price in MAD
    comparePrice: integer('compare_price'), // Slashed / Promo Price in MAD
    costPrice: integer('cost_price').notNull(), // Cost of Goods (COGS) for net margin
    stock: integer('stock').default(0).notNull(),
    images: jsonb('images').$type<string[]>().default([]).notNull(),
    variants: jsonb('variants')
      .$type<{ size?: string; color?: string; stock: number }[]>()
      .default([])
      .notNull(),
    status: text('status').default('active').notNull(), // 'active' | 'draft'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('product_store_idx').on(table.storeId),
    index('product_sku_idx').on(table.sku),
  ]
);

// ── Orders (Moroccan COD Pipeline) ────────────────────────────
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    orderNumber: text('order_number').notNull(), // e.g. "CMD-9482"
    customerName: text('customer_name').notNull(),
    phone: text('phone').notNull(),
    city: text('city').notNull(),
    address: text('address').notNull(),
    status: text('status').default('new').notNull(), // 'new' | 'to_confirm' | 'confirmed' | 'shipped' | 'shipping' | 'delivered' | 'returned' | 'canceled'
    items: jsonb('items')
      .$type<{ id: string; title: string; quantity: number; price: number; variant?: string }[]>()
      .notNull(),
    subtotal: integer('subtotal').notNull(),
    shippingFee: integer('shipping_fee').notNull(),
    total: integer('total').notNull(),
    courier: text('courier').default('ozon'), // 'ozon' | 'sendit' | 'cathedis' | 'amana' | 'manual'
    trackingNumber: text('tracking_number'), // e.g. "OZON-MA-948291"
    agentNotes: text('agent_notes'),
    abVariant: text('ab_variant').default('control').notNull(), // 'control' | 'waybill'
    deliveryType: text('delivery_type').default('home').notNull(), // 'home' | 'stopdesk'
    agencyName: text('agency_name'), // Pickup branch name if stopdesk (e.g. "Agence Ozon Bernoussi")
    source: text('source').default('web').notNull(), // 'web' | 'whatsapp'
    confirmedAt: timestamp('confirmed_at'),
    shippedAt: timestamp('shipped_at'),
    deliveredAt: timestamp('delivered_at'),
    returnedAt: timestamp('returned_at'),
    canceledAt: timestamp('canceled_at'),
    cancellationReason: text('cancellation_reason'), // 'unreachable' | 'declined' | 'fake' | 'duplicate'
    rejectionReason: text('rejection_reason'), // 'damaged' | 'refused_opening' | 'unreachable_3_attempts' | 'out_of_zone'
    manifestId: text('manifest_id'), // e.g. "MNF-20260911-891"
    manifestExportedAt: timestamp('manifest_exported_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('order_store_idx').on(table.storeId),
    index('order_number_idx').on(table.orderNumber),
    index('order_status_idx').on(table.status),
    index('order_phone_idx').on(table.phone),
    index('order_manifest_idx').on(table.manifestId),
  ]
);

// ── Customers (CRM) ───────────────────────────────────────────
export const customers = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    city: text('city').notNull(),
    totalOrders: integer('total_orders').default(1).notNull(),
    totalSpend: integer('total_spend').default(0).notNull(),
    averageBasket: integer('average_basket').default(0).notNull(),
    status: text('status').default('new').notNull(), // 'active' | 'new' | 'returning'
    lastOrderAt: timestamp('last_order_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('customer_store_idx').on(table.storeId),
    index('customer_phone_idx').on(table.phone),
  ]
);

// ── Page Layouts (Drag & Drop Builder Sections) ───────────────
export const pageLayouts = pgTable(
  'page_layouts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    sections: jsonb('sections').notNull(), // JSON list of Moroccan conversion blocks
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('page_layout_store_idx').on(table.storeId),
  ]
);

// ── Users (Merchant Owners & Admin Staff) ──────────────────────
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').default('owner').notNull(), // 'owner' | 'admin' | 'agent'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_email_idx').on(table.email),
    index('user_store_idx').on(table.storeId),
  ]
);

// ── Accounts (Master Merchant Accounts decoupled from single store) ──
export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash'),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    phone: text('phone'),
    phoneVerifiedAt: timestamp('phone_verified_at'),
    emailVerifiedAt: timestamp('email_verified_at'),
    preferredLocale: text('preferred_locale').default('fr').notNull(), // 'fr' | 'ar' | 'en'
    countryCode: text('country_code').default('MA').notNull(),
    avatarUrl: text('avatar_url'),
    is2faEnabled: text('is_2fa_enabled').default('false').notNull(),
    twoFactorSecret: text('two_factor_secret'),
    address: jsonb('address').$type<{ firstLine?: string; city?: string; postalCode?: string; country?: string }>().default({}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('account_email_idx').on(table.email),
  ]
);

// ── Store Memberships (Multi-Tenancy & Roles) ──────────────────
export const storeMemberships = pgTable(
  'store_memberships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: uuid('account_id')
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull(),
    role: text('role').default('owner').notNull(), // 'owner' | 'admin' | 'agent'
    isOwner: text('is_owner').default('true').notNull(), // 'true' | 'false'
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('membership_account_idx').on(table.accountId),
    index('membership_store_idx').on(table.storeId),
  ]
);

// ── User Sessions (Login Activity & Auditor) ───────────────────
export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: uuid('account_id')
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(),
    sessionToken: text('session_token').notNull().unique(),
    ipAddress: text('ip_address').notNull(),
    userAgent: text('user_agent').notNull(),
    browser: text('browser'),
    os: text('os'),
    city: text('city').default('Casablanca'),
    country: text('country').default('Morocco'),
    lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    isRevoked: text('is_revoked').default('false').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('session_token_idx').on(table.sessionToken),
    index('session_account_idx').on(table.accountId),
  ]
);

// ── KYC & Legal Entity Compliance ──────────────────────────────
export const kycVerifications = pgTable(
  'kyc_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: uuid('account_id')
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(),
    entityType: text('entity_type').notNull(), // 'auto_entrepreneur' | 'sarl' | 'individual'
    status: text('status').default('draft').notNull(), // 'draft' | 'pending' | 'verified' | 'rejected'
    companyName: text('company_name'),
    iceNumber: text('ice_number'),
    taxId: text('tax_id'),
    rcNumber: text('rc_number'),
    rcCity: text('rc_city'),
    cinNumber: text('cin_number'),
    bankRib: text('bank_rib'),
    bankName: text('bank_name'),
    documentUrls: jsonb('document_urls').$type<Record<string, string>>().default({}).notNull(),
    rejectionReason: text('rejection_reason'),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('kyc_account_idx').on(table.accountId),
  ]
);

// ── Support Tickets & Communication Desk ───────────────────────
export const supportTickets = pgTable(
  'support_tickets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: uuid('account_id')
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(),
    storeId: uuid('store_id').references(() => stores.id, { onDelete: 'set null' }),
    ticketNumber: text('ticket_number').notNull().unique(), // e.g. "TCK-8491"
    subject: text('subject').notNull(),
    department: text('department').notNull(), // 'billing' | 'cod_orders' | 'theme_builder' | 'technical'
    priority: text('priority').default('normal').notNull(), // 'low' | 'normal' | 'urgent'
    status: text('status').default('open').notNull(), // 'open' | 'in_progress' | 'waiting_merchant' | 'closed'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('ticket_number_idx').on(table.ticketNumber),
    index('ticket_account_idx').on(table.accountId),
  ]
);

export const ticketMessages = pgTable(
  'ticket_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id')
      .references(() => supportTickets.id, { onDelete: 'cascade' })
      .notNull(),
    senderType: text('sender_type').notNull(), // 'merchant' | 'support_staff' | 'system'
    senderId: uuid('sender_id'),
    message: text('message').notNull(),
    attachments: jsonb('attachments').$type<{ url: string; filename: string; size: number }[]>().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('ticket_msg_idx').on(table.ticketId),
  ]
);

// ── Ad Integrations & Pixels ───────────────────────────────────
export const adIntegrations = pgTable(
  'ad_integrations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => stores.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    metaPixelId: text('meta_pixel_id'),
    metaAccessToken: text('meta_access_token'),
    tiktokPixelId: text('tiktok_pixel_id'),
    tiktokAccessToken: text('tiktok_access_token'),
    snapchatPixelId: text('snapchat_pixel_id'),
    googleAnalyticsId: text('google_analytics_id'),
    googleMerchantCenterId: text('google_merchant_center_id'),
    pinterestPartnerId: text('pinterest_partner_id'),
    pinterestCreditClaimed: text('pinterest_credit_claimed').default('false').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('ad_store_idx').on(table.storeId),
  ]
);

// ── Relations ──────────────────────────────────────────────────
export const storesRelations = relations(stores, ({ many, one }) => ({
  users: many(users),
  memberships: many(storeMemberships),
  products: many(products),
  orders: many(orders),
  customers: many(customers),
  layout: one(pageLayouts, {
    fields: [stores.id],
    references: [pageLayouts.storeId],
  }),
  adIntegration: one(adIntegrations, {
    fields: [stores.id],
    references: [adIntegrations.storeId],
  }),
}));

export const accountsRelations = relations(accounts, ({ many }) => ({
  memberships: many(storeMemberships),
  sessions: many(userSessions),
  tickets: many(supportTickets),
  kyc: many(kycVerifications),
}));

export const storeMembershipsRelations = relations(storeMemberships, ({ one }) => ({
  account: one(accounts, {
    fields: [storeMemberships.accountId],
    references: [accounts.id],
  }),
  store: one(stores, {
    fields: [storeMemberships.storeId],
    references: [stores.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  store: one(stores, {
    fields: [users.storeId],
    references: [stores.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  store: one(stores, {
    fields: [customers.storeId],
    references: [stores.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  account: one(accounts, {
    fields: [supportTickets.accountId],
    references: [accounts.id],
  }),
  store: one(stores, {
    fields: [supportTickets.storeId],
    references: [stores.id],
  }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [ticketMessages.ticketId],
    references: [supportTickets.id],
  }),
}));

export const adIntegrationsRelations = relations(adIntegrations, ({ one }) => ({
  store: one(stores, {
    fields: [adIntegrations.storeId],
    references: [stores.id],
  }),
}));

export const kycVerificationsRelations = relations(kycVerifications, ({ one }) => ({
  account: one(accounts, {
    fields: [kycVerifications.accountId],
    references: [accounts.id],
  }),
}));

