-- CreateEnum
CREATE TYPE "RubricStatus" AS ENUM ('PENDING', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "Rubric" ADD COLUMN     "status" "RubricStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "rubricData" DROP NOT NULL;
