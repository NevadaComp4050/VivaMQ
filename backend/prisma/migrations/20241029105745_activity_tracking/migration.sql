-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "latestSubmissionUpload" TIMESTAMP(3),
ADD COLUMN     "latestVivaUpdate" TIMESTAMP(3),
ADD COLUMN     "modifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Rubric" ADD COLUMN     "dataModifiedAt" TIMESTAMP(3),
ADD COLUMN     "modifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VivaQuestion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
