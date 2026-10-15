-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('IN_PROCESS', 'ON_CONTROL', 'TAKE_ON_TASK', 'RETURNED_TO_INIT', 'RETURNED_TO_WORK', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReportFeedback" AS ENUM ('PHONE_NUMBER', 'EMAIL', 'NOT_REQUIRED', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "assigned_to_id" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "feedback_contact" TEXT,
    "themeId" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'IN_PROCESS',
    "feedbackType" "ReportFeedback" NOT NULL DEFAULT 'NOT_REQUIRED',
    "priority" "ReportPriority" NOT NULL DEFAULT 'MEDIUM',
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_assigned_to_id_idx" ON "reports"("assigned_to_id");

-- CreateIndex
CREATE INDEX "reports_feedbackType_idx" ON "reports"("feedbackType");

-- CreateIndex
CREATE INDEX "reports_themeId_status_idx" ON "reports"("themeId", "status");

-- CreateIndex
CREATE INDEX "reports_user_id_idx" ON "reports"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE INDEX "themes_parent_id_idx" ON "themes"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_snapshots_userId_key" ON "users_snapshots"("userId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_snapshots"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users_snapshots"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
