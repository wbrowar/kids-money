/*
  Warnings:

  - You are about to drop the column `allowance` on the `Kid` table. All the data in the column will be lost.
  - You are about to drop the column `savingForType` on the `Kid` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Kid` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adjustment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dollarAdjustment" REAL NOT NULL DEFAULT 0,
    "percentAdjustment" REAL NOT NULL DEFAULT 0,
    "totalToDate" REAL NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "kidId" INTEGER NOT NULL,
    CONSTRAINT "Adjustment_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adjustment" ("createdDate", "dollarAdjustment", "id", "kidId", "percentAdjustment", "totalToDate") SELECT "createdDate", "dollarAdjustment", "id", "kidId", "percentAdjustment", "totalToDate" FROM "Adjustment";
DROP TABLE "Adjustment";
ALTER TABLE "new_Adjustment" RENAME TO "Adjustment";
CREATE TABLE "new_Kid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#0026ff',
    "savingFor" TEXT NOT NULL DEFAULT '',
    "savingForValue" REAL NOT NULL DEFAULT 0,
    "interest" REAL NOT NULL DEFAULT 0,
    "interestThresholds" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Kid" ("color", "id", "interest", "name", "photoUrl", "savingFor") SELECT "color", "id", "interest", "name", "photoUrl", "savingFor" FROM "Kid";
DROP TABLE "Kid";
ALTER TABLE "new_Kid" RENAME TO "Kid";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
