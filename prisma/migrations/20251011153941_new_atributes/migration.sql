/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Subarea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Subarea" DROP COLUMN "createdAt";
