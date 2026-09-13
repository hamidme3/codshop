-- Migration: add country_code and currency to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'MA';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'MAD';
