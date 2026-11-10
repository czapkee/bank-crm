# Bank CRM

Монорепозиторий на Nx: NestJS-микросервисы (gRPC), API-шлюз, Vue 3 клиент, PostgreSQL, RabbitMQ и Redis.

## Состав

| Компонент | Порт | Описание |
| --- | --- | --- |
| `api/gateway` | 4000 | HTTP API, Swagger, авторизация |
| `api/user` | 5003 | Пользователи, сотрудники, авторизация |
| `api/card` | 5000 | Карты и платежи |
| `api/report` | 5002 | Обращения и темы |
| `api/log` | 5001 | Журнал событий |
| `client/main` | 4200 / 80 | Vue 3 SPA |
| PostgreSQL | 5432–5435 | По одной БД на сервис |
| RabbitMQ | 5672 / 15672 | Очередь событий |
| Redis | 6379 | Кеш журнала |

## Требования

- Node.js 26
- npm 12
- Docker и Docker Compose

## Переменные окружения

```bash
cp .env.example .env
```

Все переменные приложения начинаются с `BANK_CRM_`. Базы данных используют `CARD_DB_URL`, `LOG_DB_URL`, `REPORT_DB_URL`, `USER_DB_URL`.

Файл `.env` ищется автоматически вверх от рабочей директории процесса, поэтому он читается и при запуске из корня, и при запуске отдельного приложения. В Docker переменные передаются через `environment` в compose, файл `.env` внутрь образов не копируется.

Для локального запуска в `.env` указаны адреса `localhost`. В compose адреса БД, RabbitMQ и Redis переопределяются на имена контейнеров.

## Локальный запуск

```bash
cp .env.example .env
npm install
docker compose -f docker-compose.infra.yml up -d --build
npm run all:dev
```

- Клиент: http://localhost:4200
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- RabbitMQ UI: http://localhost:15672

`docker-compose.infra.yml` поднимает PostgreSQL, RabbitMQ, Redis и контейнер миграций. Миграции применяются автоматически при старте. Все контейнеры, тома и сеть в этом файле имеют суффикс `-infra`.

Остановить инфраструктуру:

```bash
docker compose -f docker-compose.infra.yml down
```

Удалить данные:

```bash
docker compose -f docker-compose.infra.yml down -v
```

## Docker

- `docker-files/` — Dockerfile-ы для всех сервисов, клиента и мигратора.
- `docker-compose.infra.yml` — только инфраструктура и мигратор, собираемый из `docker-files/Db-Migrator.Dockerfile`.
- `docker-compose.yml` — приложение из готовых образов.
- `docker-compose.dev.yml` — то же приложение, но с `build:` и `BANK_CRM_DEV_MODE=true`.

Собрать образы приложения:

```bash
docker compose -f docker-compose.dev.yml build
```

Запустить приложение в dev-режиме:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Запустить приложение из готовых образов:

```bash
docker compose up -d
```

Для публикации образов задайте в `.env` свой `DOCKER_REGISTRY` и `DOCKER_APPS_VERSION`, затем соберите и отправьте образы. Имена образов: `bank-crm-gateway`, `bank-crm-user`, `bank-crm-card`, `bank-crm-report`, `bank-crm-log`, `bank-crm-client`, `bank-crm-migrator`.

Приложение в Docker: клиент http://localhost:8081, API http://localhost:4000/api. Nginx проксирует `/api` на `gateway:4000`.

## Создание администратора

Первого администратора нельзя создать через API: создание сотрудника требует токен `SUPERADMIN`, а зарегистрироваться самостоятельно сотрудник может только по заранее созданной учётной записи. Поэтому первый `SUPERADMIN` создаётся скриптом напрямую в БД:

```bash
npm run seed:admin -- --email admin@bank.local --password Admin12345
```

Скрипт использует `USER_DB_URL` из `.env`, создаёт запись в `users` и `auth_employers` с ролью `SUPERADMIN` и хеширует пароль через argon2. Пароль должен содержать минимум 8 символов, строчную и заглавную буквы и цифру.

Дополнительные параметры: `--name`, `--surname`, `--phone`.

После создания войдите в клиенте на странице `/login` в режиме сотрудника или через API:

```bash
curl -X POST http://localhost:4000/api/user/employee/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bank.local","password":"Admin12345"}'
```

Дальше администратор создаёт сотрудников через `POST /api/user/employeeadmin/employees` (нужен заголовок `Authorization: Bearer <accessToken>`). Созданный сотрудник устанавливает пароль через `POST /api/user/employee/register` в течение 3 часов, после чего может входить через `/api/user/employee/login`.

## RabbitMQ и Redis

Сервисы `user`, `card` и `report` при изменяющих операциях публикуют событие `log.create` в очередь `log`. Сервис `log` — единственный потребитель этой очереди: он сразу записывает событие в таблицу `logs` своей БД.

Чтение журнала кешируется в Redis. После записи нового события версия кеша увеличивается, поэтому устаревшие страницы журнала не возвращаются. Если Redis недоступен, сервис продолжает работать без кеша.

Переменные RabbitMQ: `BANK_CRM_RMQ_URL`, `BANK_CRM_RMQ_USER`, `BANK_CRM_RMQ_PASSWORD`.

Переменные Redis: `BANK_CRM_REDIS_URL`, `BANK_CRM_REDIS_PASSWORD`, `BANK_CRM_LOG_CACHE_TTL`.
