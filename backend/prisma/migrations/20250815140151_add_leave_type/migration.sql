/*
  Warnings:

  - Added the required column `leaveType` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_employeeId_fkey`;

-- AlterTable
ALTER TABLE `leaverequest` ADD COLUMN `leaveType` VARCHAR(191) NOT NULL,
    ADD COLUMN `reason` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
