-- CreateEnum
CREATE TYPE "CardStatuses" AS ENUM ('CREATED', 'IN_PROCESS', 'PROCESSED', 'IN_DELIVERY', 'AT_CLIENT', 'EXPIRED', 'BLOCKED', 'DESTROYED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CardPaymentStatus" AS ENUM ('IN_PROCESS', 'APPROVED', 'INSUFFICIENT_FUNDS', 'DENIED_BY_FROD', 'INCORRECT_CVV', 'LIMIT_EXCEEDED', 'INCORRECT_DATA', 'INCORRECT_3D');

-- CreateEnum
CREATE TYPE "PaymentReference" AS ENUM ('PAYMENT_FOR_GOODS_AND_SERVICES', 'RETURN_AND_REFUND', 'SALARY', 'ACCOUNT_TOP_UP_VIA_ERIP', 'CARD_TO_CARD_TRANSFER');

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "card_number" INTEGER NOT NULL,
    "account_number" VARCHAR(28) NOT NULL,
    "date_of_expire" TIMESTAMP(3) NOT NULL,
    "balance" DECIMAL(30,2) NOT NULL,
    "status" "CardStatuses" NOT NULL DEFAULT 'CREATED',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "sum" DECIMAL(30,2) NOT NULL,
    "date_and_time" TIMESTAMP(3) NOT NULL,
    "service" TEXT NOT NULL,
    "reference" "PaymentReference" NOT NULL,
    "status" "CardPaymentStatus" NOT NULL DEFAULT 'IN_PROCESS',
    "card_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "cards_card_number_key" ON "cards"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "cards_account_number_key" ON "cards"("account_number");

-- CreateIndex
CREATE INDEX "cards_status_idx" ON "cards"("status");

-- CreateIndex
CREATE INDEX "payments_card_id_idx" ON "payments"("card_id");

-- CreateIndex
CREATE INDEX "payments_date_and_time_idx" ON "payments"("date_and_time");

-- CreateIndex
CREATE INDEX "payment_status_index" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_snapshots_userId_key" ON "users_snapshots"("userId");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_snapshots"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
