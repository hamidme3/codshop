import type { CollectionConfig } from 'payload';
import { superadminOnly } from '../access/roles';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'price', 'stock', 'status'],
  },
  access: {
    read: superadminOnly,
    create: superadminOnly,
    update: superadminOnly,
    delete: superadminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stock Keeping Unit (e.g. SKU-SERUM-01)',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name (e.g. Soins & Beauté, High-Tech, Maison)',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Selling Price in MAD',
      },
    },
    {
      name: 'comparePrice',
      type: 'number',
      admin: {
        description: 'Slashed / Promotional Price in MAD',
      },
    },
    {
      name: 'costPrice',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Cost of Goods Sold (COGS in MAD) for net margin tracking',
      },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Optimized product images (WebP auto-generated)',
      },
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variant combinations (Size / Color / Stock)',
      },
      fields: [
        {
          name: 'size',
          type: 'text',
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'active',
      required: true,
    },
    // ── Moroccan COD-Specific Fields ──
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: 'Product badge (e.g. "🔥 Best Seller", "⭐ New")',
      },
    },
    {
      name: 'packDuoPrice',
      type: 'number',
      admin: {
        description: 'Pack Duo price: buy 2 at this total (-100 DH discount)',
      },
    },
    {
      name: 'packDuoFreeShipping',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable free shipping for Pack Duo orders',
      },
    },
    {
      name: 'packTrioPrice',
      type: 'number',
      admin: {
        description: 'Pack Trio price: buy 3 at this total',
      },
    },
    {
      name: 'packTrioGift',
      type: 'text',
      admin: {
        description: 'Free gift description for Pack Trio',
      },
    },
    {
      name: 'quantityTiers',
      type: 'json',
      admin: {
        description: 'JSON array of { minQty, label, unitPrice, totalPrice, savings, freeShipping?, gift? }',
      },
    },
  ],
};
