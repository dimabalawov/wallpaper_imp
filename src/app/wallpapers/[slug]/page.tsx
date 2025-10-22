import { sdk } from "@/lib/api";
import ProductClient from "./ProductClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const result = await sdk.ProductBySlug({ slug: resolvedParams.slug });
  const product = result.product;

  if (!product) {
    return <div>Товар з URL {resolvedParams.slug} не знайдено.</div>;
  }

  return <ProductClient product={product} />;
}
