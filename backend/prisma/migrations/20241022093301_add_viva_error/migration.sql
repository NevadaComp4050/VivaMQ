-- AlterEnum
ALTER TYPE "VIVASTATUS" ADD VALUE 'ERROR';

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "qualityAssessment" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "Rubric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "rubricFile" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
