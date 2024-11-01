-- AlterTable
ALTER TABLE `Order` ADD COLUMN `gatewayStatus` VARCHAR(191) NULL,
    MODIFY `message` VARCHAR(500) NULL;
