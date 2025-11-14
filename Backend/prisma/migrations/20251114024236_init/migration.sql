/*
  Warnings:

  - Made the column `yearOfRelease` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `yearOfRelease` INTEGER NOT NULL;
