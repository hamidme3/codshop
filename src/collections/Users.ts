import type { CollectionConfig } from 'payload';
import { isSuperadmin, superadminOnly } from '../access/roles';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'store'],
  },
  auth: true,
  access: {
    // Only Superadmin can log into or view the Payload CMS Studio (/cms)
    admin: ({ req: { user } }) => isSuperadmin(user),
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (isSuperadmin(user)) return true;
      return { id: { equals: user.id } };
    },
    create: superadminOnly,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (isSuperadmin(user)) return true;
      return { id: { equals: user.id } };
    },
    delete: superadminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Superadmin (Platform Owner)', value: 'superadmin' },
        { label: 'Store Owner (Merchant)', value: 'store_owner' },
      ],
      defaultValue: 'store_owner',
      required: true,
      access: {
        update: ({ req: { user } }) => isSuperadmin(user),
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      admin: {
        description: 'Assigned store for this merchant (leave empty for Superadmins)',
      },
      access: {
        update: ({ req: { user } }) => isSuperadmin(user),
      },
    },
  ],
};
