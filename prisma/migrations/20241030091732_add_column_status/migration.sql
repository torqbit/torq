
-- AlterTable
ALTER TABLE `EventRegistration` DROP COLUMN `hasAccess`,
    ADD COLUMN `status` ENUM('ACCEPTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING';
