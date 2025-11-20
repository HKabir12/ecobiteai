import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Inventory
    const inventory = await db.collection("inventory").find({ userId }).toArray();
    const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
    const expiringSoon = inventory.filter(item => item.expirationDays <= 3);

    // Recent consumption logs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await db.collection("consumptionLogs")
      .find({ userId, date: { $gte: sevenDaysAgo } })
      .sort({ date: -1 })
      .toArray();

    // Collect categories from inventory + logs
    const categories = Array.from(new Set([
      ...inventory.map(item => item.category),
      ...logs.map(log => log.category)
    ]));

    // Recommend resources based on categories
    const resources = await db.collection("resources")
      .find({ category: { $in: categories } })
      .toArray();

    const recommendations = resources.map(res => ({
      ...res,
      reason: `Related to: ${res.category}`
    }));

    return NextResponse.json({
      summary: {
        totalItems,
        expiringSoonCount: expiringSoon.length,
        recentLogsCount: logs.length
      },
      expiringSoon,
      recentLogs: logs,
      recommendations
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
  }
}
