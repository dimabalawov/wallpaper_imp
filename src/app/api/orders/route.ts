import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderItemInput = {
  productDatabaseId?: number;
  productId: string;
  name: string;
  price: number;
  width: number;
  height: number;
  material: string;
  premium: boolean;
  laminate: boolean;
  glue: boolean;
};

type OrderRequestBody = {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  comment?: string;
  delivery: {
    method: string;
    type: string;
    city: string;
    cost: number;
  };
  paymentMethod: "card" | "cash-on-delivery";
  items: OrderItemInput[];
  totals: {
    itemsTotal: number;
    orderTotal: number;
  };
};

function toMoney(value: number) {
  return value.toFixed(2);
}

export async function POST(request: Request) {
  const siteUrl = process.env.WORDPRESS_SITE_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!siteUrl || !consumerKey || !consumerSecret) {
    return NextResponse.json(
      { error: "WooCommerce credentials are not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as OrderRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { customer, comment, delivery, paymentMethod, items } = body;

  if (
    !customer?.firstName ||
    !customer?.lastName ||
    !customer?.phone ||
    !customer?.email ||
    !delivery?.method ||
    !delivery?.type ||
    !delivery?.city ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (items.some((item) => !item.productDatabaseId)) {
    return NextResponse.json(
      { error: "Some items are missing product IDs" },
      { status: 400 }
    );
  }

  const paymentMethodCard = process.env.WC_PAYMENT_METHOD_CARD || "bacs";
  const paymentMethodCod = process.env.WC_PAYMENT_METHOD_COD || "cod";

  const orderPayload = {
    payment_method:
      paymentMethod === "cash-on-delivery" ? paymentMethodCod : paymentMethodCard,
    payment_method_title:
      paymentMethod === "cash-on-delivery" ? "Cash on delivery" : "Card",
    set_paid: false,
    customer_note: comment || "",
    billing: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      city: delivery.city,
    },
    shipping: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      city: delivery.city,
    },
    line_items: items.map((item) => ({
      product_id: item.productDatabaseId,
      quantity: 1,
      total: toMoney(item.price),
      meta_data: [
        { key: "SKU", value: item.productId },
        { key: "Width (cm)", value: item.width },
        { key: "Height (cm)", value: item.height },
        { key: "Material", value: item.material },
        { key: "Premium print", value: item.premium ? "yes" : "no" },
        { key: "Laminate", value: item.laminate ? "yes" : "no" },
        { key: "Glue", value: item.glue ? "yes" : "no" },
      ],
    })),
    shipping_lines:
      delivery.cost > 0
        ? [
            {
              method_id: delivery.method,
              method_title: delivery.method,
              total: toMoney(delivery.cost),
            },
          ]
        : [],
    meta_data: [
      { key: "delivery_method", value: delivery.method },
      { key: "delivery_type", value: delivery.type },
      { key: "delivery_city", value: delivery.city },
    ],
  };

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const url = `${siteUrl.replace(/\/$/, "")}/wp-json/wc/v3/orders`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  const responseText = await response.text();
  let responseData: any = null;
  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "WooCommerce order creation failed", details: responseData },
      { status: response.status }
    );
  }

  return NextResponse.json({
    orderId: responseData?.id,
    orderKey: responseData?.order_key,
  });
}
