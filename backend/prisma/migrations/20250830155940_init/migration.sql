-- AlterTable
ALTER TABLE `notification` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `Notification_employeeId_isRead_idx` ON `Notification`(`employeeId`, `isRead`);

-- CreateIndex
CREATE INDEX `Notification_type_createdAt_idx` ON `Notification`(`type`, `createdAt`);
