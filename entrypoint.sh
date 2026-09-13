#!/bin/sh
set -e

mkdir -p /app/public/uploads/products /app/public/uploads/kyc
chown -R nextjs:nodejs /app/public/uploads

exec su-exec nextjs "$@"
