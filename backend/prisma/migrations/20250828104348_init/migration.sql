/*
  Warnings:

  - The primary key for the `reporting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `downloads` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `generatedDate` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `reporting` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `reporting` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `reporting` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `status` on the `reporting` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - A unique constraint covering the columns `[employeeId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportType` to the `Reporting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Reporting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `reporting` DROP FOREIGN KEY `Reporting_adminId_fkey`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `breakEnd` DATETIME(3) NULL,
    ADD COLUMN `breakMinutes` INTEGER NULL,
    ADD COLUMN `breakStart` DATETIME(3) NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `overtime` DOUBLE NULL,
    ADD COLUMN `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_BREAK', 'EARLY_DEPARTURE', 'OVERTIME') NOT NULL DEFAULT 'ABSENT',
    ADD COLUMN `totalHours` DOUBLE NULL,
    MODIFY `checkInTime` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `goalId` INTEGER NULL,
    ADD COLUMN `reportId` INTEGER NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'REPORT_READY') NOT NULL DEFAULT 'INFO',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `employeeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reporting` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `date`,
    DROP COLUMN `downloads`,
    DROP COLUMN `generatedDate`,
    DROP COLUMN `name`,
    DROP COLUMN `size`,
    DROP COLUMN `type`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `filePath` VARCHAR(191) NULL,
    ADD COLUMN `fileSize` INTEGER NULL,
    ADD COLUMN `generatedAt` DATETIME(3) NULL,
    ADD COLUMN `parameters` JSON NULL,
    ADD COLUMN `reportType` ENUM('ATTENDANCE_SUMMARY', 'LEAVE_SUMMARY', 'PAYROLL_SUMMARY', 'EMPLOYEE_PERFORMANCE', 'DEPARTMENT_ANALYTICS', 'MONTHLY_OVERVIEW', 'YEARLY_SUMMARY', 'CUSTOM') NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `status` ENUM('PENDING', 'GENERATING', 'COMPLETED', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `Attendance_date_idx` ON `Attendance`(`date`);

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_employeeId_date_key` ON `Attendance`(`employeeId`, `date`);

-- CreateIndex
CREATE INDEX `Reporting_reportType_idx` ON `Reporting`(`reportType`);

-- CreateIndex
CREATE INDEX `Reporting_createdAt_idx` ON `Reporting`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Reporting` ADD CONSTRAINT `Reporting_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Reporting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
