/*
  Warnings:

  - You are about to drop the column `age` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `age`,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL;
