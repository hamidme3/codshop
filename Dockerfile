FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat su-exec

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create unprivileged user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone build output
COPY public ./public
RUN mkdir -p ./public/uploads/products ./public/uploads/kyc && chown -R nextjs:nodejs ./public/uploads
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static

# Ensure sharp native musl bindings match Alpine runtime
RUN npm install --legacy-peer-deps --no-save @img/sharp-linuxmusl-arm64 @img/sharp-libvips-linuxmusl-arm64

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
