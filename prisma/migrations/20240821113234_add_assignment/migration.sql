/*
  Warnings:

  - Made the column `orderId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Invoice` MODIFY `orderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `latestStatus` ENUM('PENDING', 'SUCCESS', 'FAILED', 'INITIATED') NULL;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lessonId` INTEGER NOT NULL,
    `content` JSON NULL,
    `assignmentFiles` JSON NULL,

    INDEX `Assignment_lessonId_idx`(`lessonId`),
    UNIQUE INDEX `Assignment_lessonId_key`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
