/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MASTER_ADMIN';

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'UNIV';

-- CreateIndex
CREATE UNIQUE INDEX "University_code_key" ON "University"("code");
