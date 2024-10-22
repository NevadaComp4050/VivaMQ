-- DropIndex
DROP INDEX "Submission_studentCode_key";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "vivaRequestDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
