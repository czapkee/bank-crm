-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('EMPLOYEE', 'HEAD_OF_DEPARTMENT', 'DIRECTOR', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "fathername" TEXT,
    "phone_number" TEXT NOT NULL,
    "isResident" BOOLEAN NOT NULL DEFAULT true,
    "passport" TEXT NOT NULL,
    "code_word" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "clientId" TEXT,
    "employeeId" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthClient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthEmployee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "userId" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'EMPLOYEE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_passport_key" ON "User"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthClient_email_key" ON "AuthClient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthClient_userId_key" ON "AuthClient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthEmployee_email_key" ON "AuthEmployee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthEmployee_userId_key" ON "AuthEmployee"("userId");

-- AddForeignKey
ALTER TABLE "AuthClient" ADD CONSTRAINT "AuthClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthEmployee" ADD CONSTRAINT "AuthEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
