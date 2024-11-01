-- AlterTable
ALTER TABLE `EventRegistration` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `hasAccess` BOOLEAN NOT NULL DEFAULT false;
