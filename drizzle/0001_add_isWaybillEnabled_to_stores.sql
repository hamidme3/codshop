-- Migration: add isWaybillEnabled to stores table
ALTER TABLE stores ADD COLUMN is_waybill_enabled BOOLEAN NOT NULL DEFAULT FALSE;
