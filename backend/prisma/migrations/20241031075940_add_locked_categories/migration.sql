-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "lockedCategories" TEXT[] DEFAULT ARRAY[]::TEXT[];
