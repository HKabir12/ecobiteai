// app/api/tracking/summary/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const inventory = await db.collection("inventory").find({ userId }).toArray();
    const totalItems = inventory.length;

    const logs = await db
      .collection("consumption_logs")
      .find({ userId })
      .sort({ consumedAt: -1 })
      .limit(5)
      .toArray();

    const categorySet = new Set(inventory.map((i) => i.category));
    const resources: any[] = [];

    categorySet.forEach((cat) => {
      if (cat === "Dairy") {
        resources.push({
          title: "Dairy Storage Tips",
          description: "Keep dairy products in the coldest part of the fridge. Consume within 3-5 days after opening.",
          relatedTo: "Dairy",
        });
      } else if (cat === "Fruit") {
        resources.push({
          title: "Fruit Storage Tips",
          description: "Store berries in the fridge, apples at room temperature. Consume quickly during warm seasons.",
          relatedTo: "Fruit",
        });
      }
      // add other categories as needed
    });

    return NextResponse.json({
      success: true,
      data: { totalItems, recentLogs: logs, recommendedResources: resources },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch tracking summary" }, { status: 500 });
  }
}
