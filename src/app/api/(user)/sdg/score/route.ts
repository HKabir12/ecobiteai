import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });

  try {
    const db = await dbConnect();
    const inventory = await db.collection("inventory").find({ userId }).toArray();
    const logs = await db.collection("consumption_logs").find({ userId }).toArray();

    const { score, wasteReduction, nutritionBalance, actionableTips } = calculateSDGScore(userId, inventory, logs);

    // Save weekly score
    await db.collection("sdg_scores").insertOne({
      userId,
      weekStart: new Date(), // optionally round to start of week
      score,
      wasteReduction,
      nutritionBalance,
      actionableTips,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: { score, wasteReduction, nutritionBalance, actionableTips } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to calculate SDG score" }, { status: 500 });
  }
}

// Score calculation function (as described earlier)
function calculateSDGScore(userId: string, inventory: any[], logs: any[]) {
  // 1. Waste Reduction
  let wastedItems = 0;
  inventory.forEach((item) => {
    const lastUsed = item.lastConsumedAt ? new Date(item.lastConsumedAt) : null;
    const expiration = new Date(item.addedAt);
    expiration.setDate(expiration.getDate() + item.expirationDays);
    if (!lastUsed || lastUsed > expiration) wastedItems++;
  });
  const wasteReduction = 1 - wastedItems / Math.max(inventory.length, 1);

  // 2. Nutrition Balance
  const categoriesConsumed = new Set(logs.map((l) => l.category));
  const allCategories = ["Vegetable", "Fruit", "Dairy", "Meat", "Grain", "Beverage"];
  const nutritionBalance = categoriesConsumed.size / allCategories.length;

  // 3. Combined score
  const score = Math.round((wasteReduction * 0.5 + nutritionBalance * 0.5) * 100);

  // 4. Tips
  const tips: string[] = [];
  if (nutritionBalance < 0.5) tips.push("Focus on eating more vegetables and fruits.");
  if (wasteReduction < 0.5) tips.push("Consume perishable items before expiry.");

  return { score, wasteReduction, nutritionBalance, actionableTips: tips };
}
