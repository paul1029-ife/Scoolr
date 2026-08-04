-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "description" TEXT,
ADD COLUMN     "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "room" TEXT;
