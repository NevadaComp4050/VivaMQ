-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "submissionSummaryId" TEXT;

-- CreateTable
CREATE TABLE "SubmissionSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionId" TEXT NOT NULL,
    "data" JSON NOT NULL,
    "status" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "category" TEXT,

    CONSTRAINT "SubmissionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionSummary_submissionId_key" ON "SubmissionSummary"("submissionId");

-- AddForeignKey
ALTER TABLE "SubmissionSummary" ADD CONSTRAINT "SubmissionSummary_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
