/*
  Warnings:

  - The primary key for the `reporting` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `reporting` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ALTER COLUMN `date` DROP DEFAULT,
    ALTER COLUMN `downloads` DROP DEFAULT,
    ALTER COLUMN `name` DROP DEFAULT,
    ALTER COLUMN `size` DROP DEFAULT,
    ALTER COLUMN `status` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);
