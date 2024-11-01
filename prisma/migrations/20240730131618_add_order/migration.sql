-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'INITIATED') NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `courseId` INTEGER NOT NULL,
    `gatewayProvider` ENUM('CASHFREE') NULL,
    `providerOrderId` VARCHAR(191) NULL,
    `paymentId` BIGINT NULL,
    `currency` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `paymentChannel` VARCHAR(191) NULL,
    `bankReference` VARCHAR(191) NULL,
    `paymentTime` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NULL,
    `sessionExpiry` VARCHAR(191) NULL,

    INDEX `Order_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
