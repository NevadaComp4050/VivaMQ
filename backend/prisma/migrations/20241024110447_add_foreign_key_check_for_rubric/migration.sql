-- DropForeignKey
ALTER TABLE "Rubric" DROP CONSTRAINT "Rubric_assignmentId_fkey";

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
