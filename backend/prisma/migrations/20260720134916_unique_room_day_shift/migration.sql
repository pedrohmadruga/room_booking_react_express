/*
  Warnings:

  - A unique constraint covering the columns `[roomId,day,shift]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookings_roomId_day_shift_key" ON "bookings"("roomId", "day", "shift");
