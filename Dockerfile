FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install gosu for secure step-down execution
RUN apt-get update -qq && \
    apt-get install -y -qq --no-install-recommends gosu && \
    rm -rf /var/lib/apt/lists/*

# Create unprivileged user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy static assets and standalone build output
COPY public ./public
RUN mkdir -p ./public/uploads/products ./public/uploads/kyc ./public/uploads/media && chown -R nextjs:nodejs ./public/uploads
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
