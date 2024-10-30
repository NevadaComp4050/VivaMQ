-- DropForeignKey
ALTER TABLE "Rubric" DROP CONSTRAINT "Rubric_assignmentId_fkey";

-- AlterTable
ALTER TABLE "Rubric" ALTER COLUMN "assignmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
