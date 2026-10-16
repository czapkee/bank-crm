/*
  Warnings:

  - You are about to drop the column `passport` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identif_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[num_pass]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identif_code` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_pass` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'OPERATIONIST';

-- DropIndex
DROP INDEX "users_passport_idx";

-- DropIndex
DROP INDEX "users_passport_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passport",
ADD COLUMN     "identif_code" VARCHAR(14) NOT NULL,
ADD COLUMN     "num_pass" VARCHAR(9) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_identif_code_key" ON "users"("identif_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_num_pass_key" ON "users"("num_pass");

-- CreateIndex
CREATE INDEX "users_num_pass_idx" ON "users"("num_pass");
