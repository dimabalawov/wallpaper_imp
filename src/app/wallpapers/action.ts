"use server";

import { sdk } from "@/lib/api";
// Убедитесь, что codegen сгенерировал тип ProductsPaginatedQuery
import { ProductsPaginatedQuery } from "../../../types/graphql-types";

// Определяем тип для одного узла-продукта
export type ProductNode = NonNullable<
  ProductsPaginatedQuery["products"]
> extends {
  nodes?: Array<infer T>;
}
  ? T
  : never;

// Определяем тип для ответа, который будет возвращать функция
export type PaginatedProductsResponse = {
  products: ProductNode[];
  hasNextPage: boolean;
  endCursor: string | null;
};

/**
 * Функция для получения следующей порции товаров с использованием курсора.
 * @param limit - Количество товаров для загрузки
 * @param cursor - Курсор последнего элемента предыдущей страницы (или null для первой)
 * @returns Объект с товарами и информацией для следующей страницы
 */
export async function fetchProductsByCursor(
  limit: number,
  cursor: string | null
): Promise<PaginatedProductsResponse> {
  try {
    const result = await sdk.ProductsPaginated({
      first: limit,
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
    // Возвращаем пустой результат в случае ошибки
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
    };
  }
}