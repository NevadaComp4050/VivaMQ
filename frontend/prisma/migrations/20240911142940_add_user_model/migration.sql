/*
  Warnings:

  - You are about to drop the `Tutor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `convenorId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TUTOR', 'CONVENOR');

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "convenorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tutor";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_convenorId_fkey" FOREIGN KEY ("convenorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
