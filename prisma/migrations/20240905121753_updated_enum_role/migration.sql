/*
  Warnings:

  - The values [TA] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'AUTHOR', 'ADMIN', 'MENTOR', 'NOT_ENROLLED', 'NA') NOT NULL DEFAULT 'STUDENT';
