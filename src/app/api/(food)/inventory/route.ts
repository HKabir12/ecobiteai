import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    // Connect to database (returns db, not collection)
    const db = await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const maxExpiration = searchParams.get("maxExpiration");

    const query: any = {};

    if (category) query.category = category;
    if (maxExpiration) query.expirationDays = { $lte: Number(maxExpiration) };

    const items = await db.collection("inventory").find(query).toArray();

    return NextResponse.json(items);
  } catch (err) {
    console.error("Inventory GET error:", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();
    if (!userId || !items) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const db = await dbConnect();
    await db.collection("inventory").insertMany(
      items.map((item: any) => ({ ...item, userId, createdAt: new Date() }))
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add inventory" }, { status: 500 });
  }
}
