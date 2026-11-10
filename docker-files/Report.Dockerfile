FROM node:26-alpine AS builder

WORKDIR /app

ENV NX_DAEMON=false

COPY package.json package-lock.json nx.json tsconfig.json tsconfig.base.json ./
COPY api ./api
COPY api-libs ./api-libs
COPY shared-libs ./shared-libs
COPY client ./client
COPY client-libs ./client-libs
COPY proto ./proto

RUN npm ci

RUN npx prisma generate --config api-libs/card-database/prisma7.config.ts \
 && npx prisma generate --config api-libs/log-database/prisma7.config.ts \
 && npx prisma generate --config api-libs/report-database/prisma7.config.ts \
 && npx prisma generate --config api-libs/user-database/prisma7.config.ts

RUN npx nx sync
RUN npx nx build @org/report

RUN mkdir -p /app/prod-modules/@org \
 && for link in node_modules/@org/*; do \
      name=$(basename "$link"); \
      if [ -d "$link/dist" ]; then \
        mkdir -p "/app/prod-modules/@org/$name"; \
        cp "$link/package.json" "/app/prod-modules/@org/$name/"; \
        cp -r "$link/dist" "/app/prod-modules/@org/$name/dist"; \
      fi; \
    done \
 && npm prune --omit=dev \
 && npm cache clean --force

FROM node:26-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/api/report/dist ./dist
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/nx.json ./nx.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
RUN rm -rf node_modules/@org
COPY --from=builder /app/prod-modules/@org ./node_modules/@org

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 \
 && chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]
