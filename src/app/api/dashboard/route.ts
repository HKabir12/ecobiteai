import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const db = await dbConnect();
    const inventory = db.collection("inventory");
    const logs = db.collection("consumptionLogs");
    const waste = db.collection("wasteLogs");

    // Fetch totals
    const totalItems = await inventory.countDocuments({ userId });

    const expiringSoon = await inventory.countDocuments({
      userId,
      expirationDays: { $lte: 3 },
    });

    const totalSpentData = await inventory
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, sum: { $sum: "$cost" } } },
      ])
      .toArray();

    const totalSpent = totalSpentData[0]?.sum || 0;

    // Waste chart (last 7 days)
    const wastePerDay = await waste
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$date",
            wasted: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // SDG Score (dummy formula)
    const sdgScore = Math.min(
      100,
      100 - totalSpent * 0.02 + (7 - expiringSoon) * 3
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          totalItems,
          expiringSoon,
          totalSpent,
          wastePerDay,
          sdgScore: Math.round(sdgScore),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
