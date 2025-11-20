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
