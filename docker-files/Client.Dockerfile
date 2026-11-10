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
RUN npx nx sync
RUN npx nx build @org/main

FROM nginx:alpine AS worker

COPY docker-files/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/main/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
