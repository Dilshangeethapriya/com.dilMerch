-- CreateTable
CREATE TABLE "Stock" (
    "productId" TEXT NOT NULL,
    "xsmall" INTEGER NOT NULL,
    "small" INTEGER NOT NULL,
    "medium" INTEGER NOT NULL,
    "large" INTEGER NOT NULL,
    "xLarge" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("productId")
);
