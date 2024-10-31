/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `AssignmentSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignmentId` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `content` JSON NULL,

    INDEX `AssignmentSubmission_assignmentId_studentId_idx`(`assignmentId`, `studentId`),
    INDEX `AssignmentSubmission_studentId_idx`(`studentId`),
    UNIQUE INDEX `AssignmentSubmission_id_studentId_assignmentId_key`(`id`, `studentId`, `assignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssignmentEvaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignmentId` INTEGER NOT NULL,
    `submissionId` INTEGER NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `comment` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AssignmentEvaluation_submissionId_key`(`submissionId`),
    INDEX `AssignmentEvaluation_submissionId_assignmentId_idx`(`submissionId`, `assignmentId`),
    INDEX `AssignmentEvaluation_authorId_idx`(`authorId`),
    UNIQUE INDEX `AssignmentEvaluation_submissionId_assignmentId_key`(`submissionId`, `assignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Assignment_id_key` ON `Assignment`(`id`);
