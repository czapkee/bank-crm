/*
  Warnings:

  - The values [DIRECTOR] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('EMPLOYEE', 'HEAD_OF_DEPARTMENT', 'OPERATIONIST', 'SUPERADMIN');
ALTER TABLE "public"."auth_employers" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "auth_employers" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "public"."Roles_old";
ALTER TABLE "auth_employers" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';
COMMIT;
