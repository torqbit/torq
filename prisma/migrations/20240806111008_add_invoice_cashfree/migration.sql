
-- DropIndex
DROP INDEX `Order_studentId_gatewayOrderId_idx` ON `Order`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `amount`,
    DROP COLUMN `bankReference`,
    DROP COLUMN `currency`,
    DROP COLUMN `gatewayStatus`,
    DROP COLUMN `message`,
    DROP COLUMN `paymentChannel`,
    DROP COLUMN `paymentId`,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `paymentTime`,
    DROP COLUMN `sessionExpiry`,
    DROP COLUMN `sessionId`,
    RENAME COLUMN `status` TO `latestStatus`,
    RENAME COLUMN `gatewayOrderId` TO `orderId`,
    RENAME COLUMN `gatewayProvider` TO `paymentGateway`;

-- CreateTable
CREATE TABLE `CashfreeOrder` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentMethod` VARCHAR(191) NULL,
    `gatewayStatus` ENUM('SUCCESS', 'FAILED', 'USER_DROPPED') NULL,
    `courseId` INTEGER NOT NULL,
    `gatewayProvider` ENUM('CASHFREE', 'STRIPE', 'RAZORPAY') NULL,
    `orderId` VARCHAR(191) NULL,
    `gatewayOrderId` VARCHAR(191) NULL,
    `paymentId` BIGINT NULL,
    `currency` VARCHAR(191) NULL,
    `message` VARCHAR(500) NULL,
    `paymentChannel` VARCHAR(191) NULL,
    `bankReference` VARCHAR(191) NULL,
    `paymentTime` DATETIME(3) NULL,
    `sessionId` VARCHAR(191) NULL,
    `sessionExpiry` DATETIME(3) NULL,

    INDEX `CashfreeOrder_studentId_gatewayOrderId_idx`(`studentId`, `gatewayOrderId`),
    INDEX `CashfreeOrder_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `studentId` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `paidDate` VARCHAR(191) NOT NULL,
    `taxRate` INTEGER NULL,
    `taxIncluded` BOOLEAN NOT NULL DEFAULT false,
    `orderId` VARCHAR(191) NULL,

    INDEX `Invoice_studentId_idx`(`studentId`),
    INDEX `Invoice_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Order_orderId_key` ON `Order`(`orderId`);

-- CreateIndex
CREATE INDEX `Order_studentId_orderId_idx` ON `Order`(`studentId`, `orderId`);
