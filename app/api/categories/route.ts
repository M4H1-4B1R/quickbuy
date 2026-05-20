import { NextResponse } from "next/server";
import { ShopBotClient } from "@/lib/shopbot";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")
    ?.value;
  const client = new ShopBotClient({
    token,
  });

  try {
    const categories = await client.categories.list();
    return NextResponse.json(categories);
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}
