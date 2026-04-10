/*
  Warnings:

  - You are about to drop the column `date` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `problem` on the `appointment` table. All the data in the column will be lost.
  - Added the required column `reason` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `date`,
    DROP COLUMN `problem`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `fee` DOUBLE NULL,
    ADD COLUMN `mode` ENUM('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `paid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reason` VARCHAR(191) NOT NULL,
    ADD COLUMN `scheduledAt` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') NOT NULL DEFAULT 'SCHEDULED',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
