import { NextResponse } from "next/server";
import { ShopBotClient } from "@/lib/shopbot";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")
    ?.value;
  const client = new ShopBotClient({
    token,
  });

  try {
    if (slug) {
      const product = await client.products.get(slug);
      return NextResponse.json(product);
    } else {
      const products = await client.products.list();
      return NextResponse.json(products);
    }
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}
