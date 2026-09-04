import { pgTable, uuid, text, integer, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
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
    planTier: text('plan_tier').default('starter').notNull(), // 'starter' | 'pro' | 'scale'
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
    status: text('status').default('new').notNull(), // 'new' | 'to_confirm' | 'confirmed' | 'shipping' | 'delivered' | 'returned' | 'canceled'
    items: jsonb('items')
      .$type<{ id: string; title: string; quantity: number; price: number; variant?: string }[]>()
      .notNull(),
    subtotal: integer('subtotal').notNull(),
    shippingFee: integer('shipping_fee').notNull(),
    total: integer('total').notNull(),
    courier: text('courier').default('ozon'), // 'ozon' | 'sendit' | 'manual'
    trackingNumber: text('tracking_number'), // e.g. "OZON-MA-948291"
    agentNotes: text('agent_notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('order_store_idx').on(table.storeId),
    index('order_number_idx').on(table.orderNumber),
    index('order_status_idx').on(table.status),
    index('order_phone_idx').on(table.phone),
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

// ── Relations ──────────────────────────────────────────────────
export const storesRelations = relations(stores, ({ many, one }) => ({
  users: many(users),
  products: many(products),
  orders: many(orders),
  customers: many(customers),
  layout: one(pageLayouts, {
    fields: [stores.id],
    references: [pageLayouts.storeId],
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
