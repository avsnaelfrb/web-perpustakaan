/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `coverUrl`,
    ADD COLUMN `cover` VARCHAR(191) NULL;
