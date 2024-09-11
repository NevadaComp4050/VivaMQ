/*
  Warnings:

  - You are about to drop the column `question` on the `VivaQuestion` table. All the data in the column will be lost.
  - Added the required column `questions` to the `VivaQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VivaQuestion` DROP COLUMN `question`,
    ADD COLUMN `questions` JSON NOT NULL;
