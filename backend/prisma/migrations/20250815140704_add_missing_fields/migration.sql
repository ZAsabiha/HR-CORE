/*
  Warnings:

  - Added the required column `lastUpdated` to the `HRSystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `HRSystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goals` to the `PerformanceReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewPeriod` to the `PerformanceReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hrsystem` ADD COLUMN `lastUpdated` DATETIME(3) NOT NULL,
    ADD COLUMN `version` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `performancereview` ADD COLUMN `goals` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewPeriod` VARCHAR(191) NOT NULL;
