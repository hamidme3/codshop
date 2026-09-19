import type { CollectionConfig } from 'payload';
import { superadminOnly } from '../access/roles';

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'subdomain', 'currency', 'planTier'],
  },
  access: {
    read: superadminOnly,
    create: superadminOnly,
    update: superadminOnly,
    delete: superadminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Store identifier used in subdomains (e.g. ottavio)',
      },
    },
    {
      name: 'subdomain',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'customDomain',
      type: 'text',
      admin: {
        description: 'Optional custom domain (e.g. boutique.ma)',
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'Moroccan Dirham (MAD)', value: 'MAD' },
        { label: 'Saudi Riyal (SAR)', value: 'SAR' },
        { label: 'UAE Dirham (AED)', value: 'AED' },
        { label: 'Euro (EUR)', value: 'EUR' },
        { label: 'US Dollar (USD)', value: 'USD' },
      ],
      defaultValue: 'MAD',
      required: true,
    },
    {
      name: 'planTier',
      type: 'select',
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Pro', value: 'pro' },
        { label: 'Scale', value: 'scale' },
      ],
      defaultValue: 'starter',
      required: true,
    },
    {
      name: 'isWaybillEnabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable Moroccan courier waybill checkout skin',
      },
    },
    {
      name: 'shippingSettings',
      type: 'group',
      fields: [
        {
          name: 'freeShippingThreshold',
          type: 'number',
          defaultValue: 400,
          admin: { description: 'Subtotal in MAD to unlock free delivery' },
        },
        {
          name: 'casaFee',
          type: 'number',
          defaultValue: 20,
          admin: { description: 'Delivery fee for Casablanca in MAD' },
        },
        {
          name: 'rabatFee',
          type: 'number',
          defaultValue: 25,
          admin: { description: 'Delivery fee for Rabat & Region in MAD' },
        },
        {
          name: 'otherCitiesFee',
          type: 'number',
          defaultValue: 30,
          admin: { description: 'Delivery fee for other Moroccan cities in MAD' },
        },
        {
          name: 'deliveryTimeframe',
          type: 'text',
          defaultValue: '24h à 48h',
        },
      ],
    },
  ],
};
