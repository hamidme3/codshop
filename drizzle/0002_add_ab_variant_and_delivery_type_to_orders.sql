-- Migration: add ab_variant, delivery_type, agency_name, source to orders table
ALTER TABLE orders ADD COLUMN ab_variant TEXT NOT NULL DEFAULT 'control';
ALTER TABLE orders ADD COLUMN delivery_type TEXT NOT NULL DEFAULT 'home';
ALTER TABLE orders ADD COLUMN agency_name TEXT;
ALTER TABLE orders ADD COLUMN source TEXT NOT NULL DEFAULT 'web';
