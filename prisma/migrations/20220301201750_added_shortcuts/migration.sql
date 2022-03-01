-- CreateTable
CREATE TABLE "Shortcut" (
    "id" TEXT NOT NULL,
    "shortNames" TEXT[],
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "homepage" TEXT NOT NULL,
    "searchPage" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Shortcut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shortcut" ADD CONSTRAINT "Shortcut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
