/*
  Warnings:

  - A unique constraint covering the columns `[studentCode]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "studentCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentCode_key" ON "Submission"("studentCode");
