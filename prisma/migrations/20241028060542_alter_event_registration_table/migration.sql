ALTER TABLE `EventRegistation` RENAME TO `EventRegistration`;

ALTER TABLE `EventRegistration` 
ADD COLUMN `studentId` VARCHAR(191) NULL;