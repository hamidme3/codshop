-- Migration: Add store navigation menus table
CREATE TABLE IF NOT EXISTS "menus" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "store_id" uuid NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
  "placement" text NOT NULL,
  "title" text NOT NULL,
  "items" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "menu_store_placement_idx" ON "menus" ("store_id", "placement");
CREATE INDEX IF NOT EXISTS "menu_store_idx" ON "menus" ("store_id");
