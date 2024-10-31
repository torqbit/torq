/*
  Warnings:

  - A unique constraint covering the columns `[registrationId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CashfreeOrder` MODIFY `gatewayProvider` ENUM('CASHFREE', 'STRIPE', 'RAZORPAY', 'CASH') NULL;

-- AlterTable
ALTER TABLE `Course` MODIFY `tvState` ENUM('PROCESSING', 'FAILED', 'READY', 'UPLOADING') NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `paymentMode` ENUM('OFFLINE', 'ONLINE') NOT NULL DEFAULT 'ONLINE',
    ADD COLUMN `registrationId` INTEGER NULL,
    MODIFY `paymentGateway` ENUM('CASHFREE', 'STRIPE', 'RAZORPAY', 'CASH') NULL;

-- AlterTable
ALTER TABLE `Video` MODIFY `state` ENUM('PROCESSING', 'FAILED', 'READY', 'UPLOADING') NOT NULL DEFAULT 'PROCESSING';

-- CreateIndex
CREATE UNIQUE INDEX `Order_registrationId_key` ON `Order`(`registrationId`);
