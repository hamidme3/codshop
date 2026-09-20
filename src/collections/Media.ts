import type { CollectionConfig } from 'payload';
import { superadminOnly } from '../access/roles';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Public read for storefront display
    create: superadminOnly,
    update: superadminOnly,
    delete: superadminOnly,
  },
  upload: {
    staticDir: 'public/uploads/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'mobile',
        width: 600,
        height: 600,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'desktop',
        width: 1200,
        height: 1200,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      defaultValue: '',
      admin: {
        description: 'Descriptive alt text for SEO and accessibility',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      admin: {
        description: 'The store this media belongs to',
      },
    },
  ],
};
