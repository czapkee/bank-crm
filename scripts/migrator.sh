#!/bin/sh

set -e

npx prisma migrate deploy --config ./card-database/prisma7.config.ts
npx prisma migrate deploy --config ./log-database/prisma7.config.ts
npx prisma migrate deploy --config ./report-database/prisma7.config.ts
npx prisma migrate deploy --config ./user-database/prisma7.config.ts
