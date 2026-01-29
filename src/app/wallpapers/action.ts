"use server";

import { sdk } from "@/lib/api";
import { ProductsPaginatedQuery } from "../../../types/graphql-types";

// Product node type
export type ProductNode = NonNullable<
  ProductsPaginatedQuery["products"]
> extends {
  nodes?: Array<infer T>;
}
  ? T
  : never;

// Response type with error field
export type PaginatedProductsResponse = {
  products: ProductNode[];
  hasNextPage: boolean;
  endCursor: string | null;
  error?: string;
};

// Constants for validation
const MAX_LIMIT = 50;
const MIN_LIMIT = 1;

/**
 * Fetches paginated products using cursor-based pagination.
 * @param limit - Number of products to fetch (1-50)
 * @param cursor - Cursor from previous page (or null for first page)
 * @returns Products with pagination info
 */
export async function fetchProductsByCursor(
  limit: number,
  cursor: string | null
): Promise<PaginatedProductsResponse> {
  // Input validation
  if (typeof limit !== "number" || !Number.isInteger(limit)) {
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
      error: "Invalid limit parameter",
    };
  }

  // Clamp limit to valid range
  const safeLimit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, limit));

  // Validate cursor format (should be base64 or null)
  if (cursor !== null && typeof cursor !== "string") {
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
      error: "Invalid cursor parameter",
    };
  }

  try {
    const result = await sdk.ProductsPaginated({
      first: safeLimit,
      after: cursor,
    });

    const products = result.products?.nodes || [];
    const pageInfo = result.products?.pageInfo;

    return {
      products,
      hasNextPage: pageInfo?.hasNextPage || false,
      endCursor: pageInfo?.endCursor || null,
    };
  } catch (error) {
    console.error("Failed to fetch paginated products:", error);
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
      error: "Failed to load products",
    };
  }
}