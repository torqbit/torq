-- AlterTable
ALTER TABLE `EventRegistration` ADD COLUMN `certificatePdfPath` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `EventRegistration` RENAME INDEX `EventRegistation_email_idx` TO `EventRegistration_email_idx`;

-- RenameIndex
ALTER TABLE `EventRegistration` RENAME INDEX `EventRegistation_eventId_email_key` TO `EventRegistration_eventId_email_key`;

-- RenameIndex
ALTER TABLE `EventRegistration` RENAME INDEX `EventRegistation_eventId_idx` TO `EventRegistration_eventId_idx`;
