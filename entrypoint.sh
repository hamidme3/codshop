#!/bin/sh
set -e

mkdir -p /app/public/uploads/products /app/public/uploads/kyc /app/public/uploads/media
chown -R nextjs:nodejs /app/public/uploads

if command -v gosu >/dev/null 2>&1; then
  exec gosu nextjs "$@"
elif command -v su-exec >/dev/null 2>&1; then
  exec su-exec nextjs "$@"
else
  exec su -s /bin/sh nextjs -c "$*"
fi
