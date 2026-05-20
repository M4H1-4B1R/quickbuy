import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ShopBotClient } from "@/lib/shopbot";
import { ApiError } from "@/lib/shopbot.types";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }

  const shopbot = new ShopBotClient({
    baseUrl: process.env.SHOPBOT_API!,
  });

  try {
    const { token } = await shopbot.auth.login({ username, password });

    cookies().set(process.env.JWT_COOKIE_NAME || "shopbot_jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
