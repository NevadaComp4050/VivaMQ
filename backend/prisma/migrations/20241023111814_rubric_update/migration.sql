/*
  Warnings:

  - You are about to drop the column `name` on the `Rubric` table. All the data in the column will be lost.
  - You are about to drop the column `rubricFile` on the `Rubric` table. All the data in the column will be lost.
  - Added the required column `rubricData` to the `Rubric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Rubric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rubric" DROP COLUMN "name",
DROP COLUMN "rubricFile",
ADD COLUMN     "rubricData" JSON NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
