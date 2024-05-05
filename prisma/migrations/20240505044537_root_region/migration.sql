/*
  Warnings:

  - A unique constraint covering the columns `[rootRegionId]` on the table `World` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "World_rootRegionId_key" ON "World"("rootRegionId");
