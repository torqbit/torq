-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('STUDENT', 'AUTHOR', 'ADMIN', 'TA') NOT NULL DEFAULT 'STUDENT',
    `theme` ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'light',
    `dateJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` TEXT NULL,
    `scope` TEXT NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,
    `oauth_token_secret` VARCHAR(191) NULL,
    `oauth_token` TEXT NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_session_token_key`(`session_token`),
    UNIQUE INDEX `Session_accessToken_key`(`accessToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `courseId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `about` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `slug` VARCHAR(191) NULL,
    `tvProviderId` VARCHAR(191) NULL,
    `tvProviderName` VARCHAR(191) NULL,
    `tvUrl` VARCHAR(191) NULL,
    `tvThumbnail` VARCHAR(191) NULL,
    `tvState` ENUM('PROCESSING', 'FAILED', 'READY') NULL,
    `thumbnail` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `skills` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `courseType` ENUM('PAID', 'FREE') NOT NULL DEFAULT 'FREE',
    `certificateTemplate` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `coursePrice` DOUBLE NULL DEFAULT 0,
    `sequenceId` INTEGER NULL,
    `previewMode` BOOLEAN NULL,
    `expiryInDays` INTEGER NOT NULL DEFAULT 365,
    `difficultyLevel` ENUM('Beginner', 'Intermediate', 'Advance') NULL,
    `durationInMonths` INTEGER NOT NULL DEFAULT 12,
    `totalResources` INTEGER NOT NULL DEFAULT 0,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',

    INDEX `Course_authorId_idx`(`authorId`),
    UNIQUE INDEX `Course_slug_key`(`slug`),
    UNIQUE INDEX `Course_courseId_name_key`(`courseId`, `name`),
    PRIMARY KEY (`courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapter` (
    `chapterId` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `objective` TEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `sequenceId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Chapter_courseId_idx`(`courseId`),
    UNIQUE INDEX `Chapter_chapterId_key`(`chapterId`),
    PRIMARY KEY (`chapterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `resourceId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `chapterId` INTEGER NOT NULL,
    `sequenceId` INTEGER NOT NULL,
    `contentType` ENUM('Video', 'Assignment') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Resource_chapterId_idx`(`chapterId`),
    UNIQUE INDEX `Resource_resourceId_key`(`resourceId`),
    PRIMARY KEY (`resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoUrl` VARCHAR(200) NOT NULL,
    `providerVideoId` VARCHAR(500) NULL,
    `videoDuration` INTEGER NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `thumbnail` VARCHAR(200) NOT NULL,
    `state` ENUM('PROCESSING', 'FAILED', 'READY') NOT NULL DEFAULT 'PROCESSING',
    `mediaProvider` VARCHAR(191) NULL,

    UNIQUE INDEX `Video_resourceId_key`(`resourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseRegistration` (
    `registrationId` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseState` ENUM('ENROLLED', 'STARTED', 'COMPLETED') NOT NULL DEFAULT 'ENROLLED',
    `courseType` ENUM('PAID', 'FREE') NOT NULL DEFAULT 'FREE',
    `image` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `dateJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expireIn` DATETIME(3) NULL,

    INDEX `CourseRegistration_studentId_idx`(`studentId`),
    INDEX `CourseRegistration_courseId_idx`(`courseId`),
    UNIQUE INDEX `CourseRegistration_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`registrationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseProgress` (
    `courseProgressId` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseProgress_resourceId_idx`(`resourceId`),
    INDEX `CourseProgress_courseId_idx`(`courseId`),
    UNIQUE INDEX `CourseProgress_studentId_resourceId_key`(`studentId`, `resourceId`),
    PRIMARY KEY (`courseProgressId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discussion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `tagCommentId` INTEGER NULL,
    `comment` TEXT NULL,
    `attachedFiles` JSON NULL,
    `parentCommentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Discussion_id_key`(`id`),
    INDEX `Discussion_userId_idx`(`userId`),
    INDEX `Discussion_resourceId_idx`(`resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notificationType` ENUM('COMMENT', 'EVALUATE_ASSIGNMENT') NOT NULL,
    `fromUserId` VARCHAR(191) NOT NULL,
    `resourceId` INTEGER NULL,
    `toUserId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `tagCommentId` INTEGER NULL,
    `commentId` INTEGER NULL,
    `isView` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Notification_id_key`(`id`),
    INDEX `Notification_fromUserId_idx`(`fromUserId`),
    INDEX `Notification_toUserId_idx`(`toUserId`),
    INDEX `Notification_tagCommentId_idx`(`tagCommentId`),
    INDEX `Notification_commentId_idx`(`commentId`),
    INDEX `Notification_resourceId_idx`(`resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` VARCHAR(191) NOT NULL,
    `comment` TEXT NULL,
    `attachedFiles` JSON NULL,
    `isView` BOOLEAN NOT NULL DEFAULT false,
    `parentConversationId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Conversation_id_key`(`id`),
    INDEX `Conversation_authorId_idx`(`authorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserJoinWaiting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `sequenceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserJoinWaiting_id_email_key`(`id`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceProvider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_type` VARCHAR(20) NOT NULL,
    `provider_name` TEXT NOT NULL,
    `providerDetail` JSON NULL,
    `dt_added` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ServiceProvider_service_type_key`(`service_type`),
    UNIQUE INDEX `ServiceProvider_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseCertificates` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `imagePath` VARCHAR(191) NULL,
    `pdfPath` VARCHAR(191) NULL,
    `issueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CourseCertificates_studentId_idx`(`studentId`),
    UNIQUE INDEX `CourseCertificates_courseId_studentId_key`(`courseId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mailSent` BOOLEAN NOT NULL,
    `mailSentDate` DATETIME(3) NULL,
    `isEmailVerified` BOOLEAN NOT NULL,

    UNIQUE INDEX `CourseNotification_id_key`(`id`),
    INDEX `CourseNotification_email_idx`(`email`),
    UNIQUE INDEX `CourseNotification_email_courseId_key`(`email`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` JSON NOT NULL,
    `banner` VARCHAR(191) NOT NULL,
    `contentType` VARCHAR(191) NULL,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL,

    UNIQUE INDEX `Blog_id_key`(`id`),
    UNIQUE INDEX `Blog_slug_key`(`slug`),
    INDEX `Blog_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
