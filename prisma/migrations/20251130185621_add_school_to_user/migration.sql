-- AlterTable
ALTER TABLE "User" ADD COLUMN     "schoolId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
