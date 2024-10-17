-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('OWNER', 'READ_ONLY', 'READ_WRITE');

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "UnitAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "role" "AccessRole" NOT NULL,
    "status" "AccessStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "UnitAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitAccess_userId_unitId_key" ON "UnitAccess"("userId", "unitId");

-- AddForeignKey
ALTER TABLE "UnitAccess" ADD CONSTRAINT "UnitAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAccess" ADD CONSTRAINT "UnitAccess_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
