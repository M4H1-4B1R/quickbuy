import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ShopBotClient } from "@/lib/shopbot";
import { mapDjangoToShopBot, seedToShopBot, type DjangoDump } from "@/scripts/seed-from-dump";
import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

export async function POST() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shopbotApi = process.env.SHOPBOT_API || "http://localhost:4100";
  const client = new ShopBotClient({
    baseUrl: shopbotApi,
    token: jwt,
  });

  const fixturePath = resolve(join(__dirname, "..", "..", "..", "scripts", "fixtures", "roadsters-seed.json"));

  if (!existsSync(fixturePath)) {
    return NextResponse.json(
      { error: "Seed fixture not found" },
      { status: 500 }
    );
  }

  try {
    let dump: DjangoDump;
    try {
      dump = JSON.parse(readFileSync(fixturePath, "utf-8"));
    } catch {
      return NextResponse.json(
        { error: "Invalid seed fixture JSON" },
        { status: 500 }
      );
    }

    try {
      await client.store.wipe();
    } catch (wipeErr) {
      console.warn("Store wipe failed (endpoint may not exist yet):", wipeErr);
    }

    const payload = mapDjangoToShopBot(dump);

    const results = await seedToShopBot(
      client,
      payload,
      (msg) => console.log(`[seed] ${msg}`)
    );

    return NextResponse.json({
      ok: true,
      summary: {
        categories: results.categories,
        products: results.products,
        coupons: results.coupons,
        shipping: results.shipping,
        banners: results.banners,
        swipers: results.swipers,
        newsletters: results.newsletters,
      },
    });
  } catch (err) {
    console.error("Reset demo failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reset failed" },
      { status: 500 }
    );
  }
}