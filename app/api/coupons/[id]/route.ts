import { NextResponse } from "next/server";
import { ShopBotClient } from "@/lib/shopbot";
import { cookies } from "next/headers";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")?.value;
  const client = new ShopBotClient({ token });
  const body = await request.json();

  try {
    const result = await client.coupons.update(id, body);
    return NextResponse.json(result);
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = cookies().get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")?.value;
  const client = new ShopBotClient({ token });

  try {
    await client.coupons.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const e = error as { status?: number; message: string };
    return new NextResponse(e.message, { status: e.status || 500 });
  }
}