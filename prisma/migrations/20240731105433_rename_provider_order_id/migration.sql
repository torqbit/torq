/*
  Warnings:

  - You are about to drop the column `providerOrderId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Order_studentId_idx` ON `Order`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `providerOrderId`,
    ADD COLUMN `gatewayOrderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Order_studentId_gatewayOrderId_idx` ON `Order`(`studentId`, `gatewayOrderId`);
