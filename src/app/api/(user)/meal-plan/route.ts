import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const { userId, weeklyBudget } = await req.json();
    const db = await dbConnect();

    const inventory = await db.collection("inventory").find({ userId }).toArray();
    const nutritionRules = await db.collection("nutritionRules").find({}).toArray();
    const costData = await db.collection("localCost").find({}).toArray();

    let plan: any[] = [];
    let totalCost = 0;

    for (const rule of nutritionRules) {
      // Use inventory first
      const items = inventory.filter((i: any) => i.category === rule.category);
      let count = 0;

      for (const item of items) {
        if (count >= rule.minPerWeek) break;
        plan.push({ name: item.name, quantity: 1, unit: item.unit, source: "Inventory" });
        count++;
      }

      // Fill with local cost items if needed
      if (count < rule.minPerWeek) {
        const alternatives = costData.filter((c: any) => c.category === rule.category);
        for (const alt of alternatives) {
          if (count >= rule.minPerWeek) break;
          plan.push({ name: alt.name, quantity: 1, unit: alt.unit, source: "Buy", cost: alt.cost });
          totalCost += alt.cost;
          count++;
        }
      }
    }

    // Check budget
    if (totalCost > weeklyBudget) {
      return NextResponse.json({
        success: false,
        message: "Weekly budget exceeded. Reduce portions or select cheaper items."
      });
    }

    return NextResponse.json({ success: true, plan, totalCost });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to generate meal plan" }, { status: 500 });
  }
}
