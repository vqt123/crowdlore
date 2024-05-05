-- AddForeignKey
ALTER TABLE "World" ADD CONSTRAINT "World_rootRegionId_fkey" FOREIGN KEY ("rootRegionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
