/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Made the column `orderId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `pdfPath` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `amount` INTEGER NULL,
    ADD COLUMN `currency` VARCHAR(191) NULL;
    

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_orderId_key` ON `Invoice`(`orderId`);
