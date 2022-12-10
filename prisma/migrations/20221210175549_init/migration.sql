-- CreateTable
CREATE TABLE "Adjustment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL,
    "dollarAdjustment" REAL NOT NULL,
    "percentAdjustment" REAL NOT NULL,
    "totalToDate" REAL NOT NULL,
    "kidId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Kid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "savingFor" TEXT NOT NULL,
    "savingForType" TEXT NOT NULL,
    "allowance" REAL NOT NULL,
    "interest" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grownUp" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
