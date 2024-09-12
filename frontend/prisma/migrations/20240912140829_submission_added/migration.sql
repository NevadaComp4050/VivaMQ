/*
  Warnings:

  - Added the required column `studentId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "studentId" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PDFSubmission" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileContent" BYTEA NOT NULL,
    "extractedText" TEXT,

    CONSTRAINT "PDFSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PDFSubmission_submissionId_key" ON "PDFSubmission"("submissionId");

-- AddForeignKey
ALTER TABLE "PDFSubmission" ADD CONSTRAINT "PDFSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
