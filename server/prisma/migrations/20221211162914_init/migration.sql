-- CreateTable
CREATE TABLE "Adjustment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dollarAdjustment" REAL NOT NULL DEFAULT 0,
    "percentAdjustment" REAL NOT NULL DEFAULT 0,
    "totalToDate" REAL NOT NULL,
    "kidId" INTEGER NOT NULL,
    CONSTRAINT "Adjustment_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#0026ff',
    "savingFor" TEXT NOT NULL DEFAULT '',
    "savingForType" TEXT NOT NULL DEFAULT 'text',
    "allowance" REAL NOT NULL DEFAULT 0,
    "interest" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grownUp" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Kid_slug_key" ON "Kid"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
