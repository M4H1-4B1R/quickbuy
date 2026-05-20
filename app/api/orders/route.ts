import { NextResponse } from "next/server";
import { ShopBotClient } from "@/lib/shopbot";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")
    ?.value;
  const client = new ShopBotClient({
    token,
  });

  try {
    if (id) {
      const order = await client.orders.get(id);
      return NextResponse.json(order);
    } else {
      const orders = await client.orders.list();
      return NextResponse.json(orders);
    }
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}
