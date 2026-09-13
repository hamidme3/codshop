-- Add country column to stores table for multi-country support
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "country" text DEFAULT 'MA' NOT NULL;
