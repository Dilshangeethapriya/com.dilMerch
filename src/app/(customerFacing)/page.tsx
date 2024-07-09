import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { resolve } from "path";
import { Suspense } from "react";

// getting product data from the database based on ordercunt
function getMostPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}
// getting product data from the database based on date
function getLatestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

// home page componant
export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}></ProductGridSection>
      <ProductGridSection
        title="Latest"
        productsFetcher={getLatestProducts}></ProductGridSection>
    </main>
  );
}

// initializing props type
type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

// product grid section componants to renderthe porduct details onto the home page
function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
            </>
          }>
          <ProductSuspense productsFetcher={productsFetcher}></ProductSuspense>
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product}></ProductCard>
  ));
}
