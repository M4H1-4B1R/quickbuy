import { NextResponse } from "next/server";
import { ShopBotClient } from "@/lib/shopbot";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")?.value;
  const client = new ShopBotClient({ token });

  try {
    if (id) {
      const result = await client.customers.get(id);
      return NextResponse.json(result);
    }
    const result = await client.customers.list();
    return NextResponse.json(result);
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}