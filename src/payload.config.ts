import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Stores } from './collections/Stores';
import { Products } from './collections/Products';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: '/cms',
    api: '/api/cms',
  },
  collections: [Users, Stores, Products, Media, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'codshop-payload-secret-key-2026-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://codshop_user:codshop_secret_password@localhost:5432/codshop_db',
    },
    schemaName: 'payload',
  }),
  sharp,
});
