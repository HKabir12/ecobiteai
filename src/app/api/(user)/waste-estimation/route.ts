import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const db = await dbConnect();
    const inventory = await db.collection("inventory").find({ userId }).toArray();

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Compute weekly/monthly waste
    let weeklyWaste = 0;
    let monthlyWaste = 0;
    let weeklyMoney = 0;
    let monthlyMoney = 0;

    inventory.forEach((item: any) => {
      const wastedQty = item.wastedQuantity || 0;
      const pricePerUnit = item.pricePerUnit || 0;
      const addedAt = new Date(item.addedAt);

      if (addedAt >= oneWeekAgo) {
        weeklyWaste += wastedQty;
        weeklyMoney += wastedQty * pricePerUnit;
      }
      if (addedAt >= oneMonthAgo) {
        monthlyWaste += wastedQty;
        monthlyMoney += wastedQty * pricePerUnit;
      }
    });

    // Dummy community average (static for now)
    const communityWeeklyWaste = 5; // grams
    const communityMonthlyWaste = 20; // grams

    return NextResponse.json({
      success: true,
      data: {
        weekly: { waste: weeklyWaste, moneyLost: weeklyMoney, communityAverage: communityWeeklyWaste },
        monthly: { waste: monthlyWaste, moneyLost: monthlyMoney, communityAverage: communityMonthlyWaste },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to calculate waste" }, { status: 500 });
  }
}
