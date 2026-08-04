-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('PUBLIC', 'PRIVATE', 'MISSION', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "Stream" AS ENUM ('SCIENCE', 'ARTS', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "class_rooms" ADD COLUMN     "stream" "Stream";

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "lga" TEXT,
ADD COLUMN     "motto" TEXT,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "principalName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "type" "SchoolType" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "grading_scales" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'WAEC Standard',
    "caWeight" INTEGER NOT NULL DEFAULT 30,
    "examWeight" INTEGER NOT NULL DEFAULT 70,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_bands" (
    "id" TEXT NOT NULL,
    "scaleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "isPass" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "grade_bands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "grading_scales_schoolId_idx" ON "grading_scales"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "grading_scales_schoolId_name_key" ON "grading_scales"("schoolId", "name");

-- CreateIndex
CREATE INDEX "grade_bands_scaleId_idx" ON "grade_bands"("scaleId");

-- CreateIndex
CREATE UNIQUE INDEX "grade_bands_scaleId_code_key" ON "grade_bands"("scaleId", "code");

-- AddForeignKey
ALTER TABLE "grading_scales" ADD CONSTRAINT "grading_scales_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_bands" ADD CONSTRAINT "grade_bands_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "grading_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
