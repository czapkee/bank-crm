FROM node:26-alpine AS worker

WORKDIR /app

RUN npm install --no-package-lock prisma@7.10.0 dotenv

COPY scripts/migrator.sh ./migrator.sh

COPY api-libs/card-database/prisma ./card-database/prisma
COPY api-libs/card-database/prisma7.config.ts ./card-database/prisma7.config.ts

COPY api-libs/log-database/prisma ./log-database/prisma
COPY api-libs/log-database/prisma7.config.ts ./log-database/prisma7.config.ts

COPY api-libs/report-database/prisma ./report-database/prisma
COPY api-libs/report-database/prisma7.config.ts ./report-database/prisma7.config.ts

COPY api-libs/user-database/prisma ./user-database/prisma
COPY api-libs/user-database/prisma7.config.ts ./user-database/prisma7.config.ts

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 \
 && chown -R nodejs:nodejs /app \
 && chmod +x migrator.sh

USER nodejs

CMD ["./migrator.sh"]
