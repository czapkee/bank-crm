/*
  Warnings:

  - You are about to drop the `AuthClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthEmployee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthClient" DROP CONSTRAINT "AuthClient_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuthEmployee" DROP CONSTRAINT "AuthEmployee_userId_fkey";

-- DropTable
DROP TABLE "AuthClient";

-- DropTable
DROP TABLE "AuthEmployee";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "father_name" TEXT,
    "phone_number" TEXT NOT NULL,
    "is_resident" BOOLEAN NOT NULL DEFAULT true,
    "passport" TEXT NOT NULL,
    "code_word" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "client_id" TEXT,
    "employee_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_clients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_employers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "userId" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'EMPLOYEE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_employers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_passport_key" ON "users"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "users_client_id_key" ON "users"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex
CREATE INDEX "users_passport_idx" ON "users"("passport");

-- CreateIndex
CREATE INDEX "users_address_idx" ON "users"("address");

-- CreateIndex
CREATE INDEX "users_name_surname_idx" ON "users"("name", "surname");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "auth_clients_email_key" ON "auth_clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_clients_userId_key" ON "auth_clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_employers_email_key" ON "auth_employers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_employers_userId_key" ON "auth_employers"("userId");

-- AddForeignKey
ALTER TABLE "auth_clients" ADD CONSTRAINT "auth_clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_employers" ADD CONSTRAINT "auth_employers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
