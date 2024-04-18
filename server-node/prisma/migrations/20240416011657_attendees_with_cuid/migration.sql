/*
  Warnings:

  - The primary key for the `attendees` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registry_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    "check_in" DATETIME,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendees" ("check_in", "email", "event_id", "id", "name", "registry_date") SELECT "check_in", "email", "event_id", "id", "name", "registry_date" FROM "attendees";
DROP TABLE "attendees";
ALTER TABLE "new_attendees" RENAME TO "attendees";
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;