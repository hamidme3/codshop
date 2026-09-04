// @ts-nocheck
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://codshop_user:codshop_secret_password@localhost:5432/codshop_db',
  },
});
