-- Migration: Add store custom pages and legal policies table
CREATE TABLE IF NOT EXISTS "pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "store_id" uuid NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "content" text NOT NULL,
  "policy_type" text NOT NULL DEFAULT 'custom',
  "is_system_policy" boolean NOT NULL DEFAULT false,
  "is_published" boolean NOT NULL DEFAULT true,
  "seo_title" text,
  "seo_description" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "page_store_slug_idx" ON "pages" ("store_id", "slug");
CREATE INDEX IF NOT EXISTS "page_store_idx" ON "pages" ("store_id");
