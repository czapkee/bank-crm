-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "entity" TEXT,
    "method" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "user_id" TEXT,
    "data" JSONB,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_service_entity_idx" ON "logs"("service", "entity");

-- CreateIndex
CREATE INDEX "logs_user_id_created_at_idx" ON "logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "logs_method_idx" ON "logs"("method");

-- CreateIndex
CREATE INDEX "logs_action_idx" ON "logs"("action");
