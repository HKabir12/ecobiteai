import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const type = searchParams.get("type");

    const query: any = {};

    if (category) query.category = category;
    if (type) query.type = type;

    const resources = await db.collection("resources").find(query).toArray();

    return NextResponse.json(resources);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
