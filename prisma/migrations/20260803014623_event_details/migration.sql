-- AlterTable
ALTER TABLE "events" ADD COLUMN     "classRoomId" TEXT,
ADD COLUMN     "programme" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "termId" TEXT;

-- CreateTable
CREATE TABLE "event_materials" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_materials_eventId_idx" ON "event_materials"("eventId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "class_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_materials" ADD CONSTRAINT "event_materials_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
