import type { CollectionConfig } from 'payload';
import { superadminOnly } from '../access/roles';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'store', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read for storefront policy pages
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
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL slug (e.g. conditions-generales, livraison-retours, faq)',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Page content / markdown for store policies and information',
      },
    },
  ],
};
