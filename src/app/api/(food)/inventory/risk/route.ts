import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  expirationDays: number;
  consumptionFrequency: number;
  addedAt: Date;
}

// Dummy rule-based risk calculation
function calculateRiskScore(item: InventoryItem, season: string): number {
  let score = 0;

  // Expiration factor
  if (item.expirationDays <= 2) score += 50;
  else if (item.expirationDays <= 5) score += 30;
  else if (item.expirationDays <= 10) score += 10;

  // Seasonality factor
  if (item.category === "Fruit" && season === "Summer") score += 20;
  if (item.category === "Vegetable" && season === "Winter") score += 5;

  // Consumption frequency factor (0=rarely, 10=often)
  if (item.consumptionFrequency <= 2) score += 10;

  return score; // higher = higher risk
}

export async function GET() {
  try {
    const db = await dbConnect();
    const items = await db.collection("inventory").find().toArray() as InventoryItem[];

    const currentMonth = new Date().getMonth(); // 0=Jan
    const season =
      currentMonth >= 5 && currentMonth <= 8
        ? "Summer"
        : currentMonth >= 2 && currentMonth <= 4
        ? "Spring"
        : currentMonth >= 9 && currentMonth <= 11
        ? "Fall"
        : "Winter";

    const itemsWithRisk = items.map((item) => ({
      ...item,
      riskScore: calculateRiskScore(item, season),
    }));

    const prioritized = itemsWithRisk.sort((a, b) => b.riskScore - a.riskScore);

    return NextResponse.json({ prioritized });
  } catch (err) {
    console.error("Risk API error:", err);
    return NextResponse.json({ error: "Failed to fetch risk data" }, { status: 500 });
  }
}
