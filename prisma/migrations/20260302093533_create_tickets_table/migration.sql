-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DKK',
    "seat" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "purchasedBy" TEXT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);
