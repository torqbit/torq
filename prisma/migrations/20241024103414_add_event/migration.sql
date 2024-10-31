-- CreateTable
CREATE TABLE `Events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `banner` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `description` MEDIUMTEXT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `eventType` ENUM('WORKSHOP', 'TALK') NULL,
    `price` INTEGER NULL,
    `eventInstructions` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `certificate` BOOLEAN NOT NULL DEFAULT false,
    `certificateTemplate` VARCHAR(191) NULL,
    `eventLink` VARCHAR(191) NULL,
    `eventMode` ENUM('ONLINE', 'OFFLINE') NULL,
    `registrationEndDate` DATETIME(3) NULL,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Events_title_key`(`title`),
    UNIQUE INDEX `Events_slug_key`(`slug`),
    INDEX `Events_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventRegistation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `eventId` INTEGER NOT NULL,
    `attended` BOOLEAN NOT NULL DEFAULT false,
    `certificate` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EventRegistation_email_idx`(`email`),
    INDEX `EventRegistation_eventId_idx`(`eventId`),
    UNIQUE INDEX `EventRegistation_eventId_email_key`(`eventId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
