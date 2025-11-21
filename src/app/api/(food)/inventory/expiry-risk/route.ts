import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

type Item = {
  _id: string;
  name: string;
  category: string;
  addedAt: string;
  expirationDays: number;
  lastConsumedAt?: string;
};

function calculateRisk(item: Item) {
  const now = new Date();
  const addedAt = new Date(item.addedAt);
  const expirationDate = new Date(addedAt);
  expirationDate.setDate(expirationDate.getDate() + item.expirationDays);

  // Base risk: how close to expiration
  const daysLeft = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  let baseRisk = 1 - Math.max(daysLeft / item.expirationDays, 0);

  // Category factor
  const categoryFactor: Record<string, number> = {
    Fruit: 0.3,
    Vegetable: 0.25,
    Dairy: 0.2,
    Meat: 0.2,
    Grain: 0.1,
    Beverage: 0.05,
  };
  baseRisk += categoryFactor[item.category] || 0.1;

  // Seasonality (dummy: summer = Jun-Aug)
  const month = now.getMonth() + 1;
  if (item.category === "Fruit" && month >= 6 && month <= 8) baseRisk += 0.1;

  // Consumption frequency
  if (item.lastConsumedAt) {
    const lastUsed = new Date(item.lastConsumedAt);
    const daysSinceUsed = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUsed > 7) baseRisk += 0.1;
  }

  return Math.min(Math.max(baseRisk, 0), 1);
}

export async function GET(req: Request) {
  try {
    const db = await dbConnect();

    // Fetch all inventory documents
    const docs = await db.collection("inventory").find({}).toArray();

    // Map MongoDB documents to our Item type
    const items: Item[] = docs.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name || "Unknown",
      category: doc.category || "Other",
      addedAt: doc.addedAt ? new Date(doc.addedAt).toISOString() : new Date().toISOString(),
      expirationDays: doc.expirationDays || 7,
      lastConsumedAt: doc.lastConsumedAt ? new Date(doc.lastConsumedAt).toISOString() : undefined,
    }));

    // Compute risk and alerts
    const itemsWithRisk = items.map((item) => {
      const risk = calculateRisk(item);
      const alert = risk >= 0.6 ? "High Risk – Consume Soon" : risk >= 0.3 ? "Medium Risk" : "Low Risk";
      return { ...item, risk, alert };
    });

    // Sort high risk first
    itemsWithRisk.sort((a, b) => b.risk - a.risk);

    return NextResponse.json({ success: true, data: itemsWithRisk });
  } catch (err) {
    console.error("Expiry Risk Error:", err);
    return NextResponse.json({ success: false, error: "Failed to compute expiry risk" }, { status: 500 });
  }
}
