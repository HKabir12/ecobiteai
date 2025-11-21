"use client";
import { useState } from "react";

interface MealPlanItem {
  name: string;
  quantity: number;
  unit: string;
  source?: "Inventory" | "Buy";
  cost?: number;
}

export default function MealPlanner({ userId }: { userId: string }) {
  const [budget, setBudget] = useState(20);
  const [plan, setPlan] = useState<MealPlanItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, weeklyBudget: budget })
      });

      const data = await res.json();
      if (data.success) {
        setPlan(data.plan);
        setTotalCost(data.totalCost);
      } else {
        setError(data.message || "Failed to generate meal plan");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <h2 className="text-xl font-bold mb-4">Weekly Meal Planner</h2>
      <label className="block mb-4">
        Weekly Budget ($):
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="border p-2 rounded w-full mt-1"
        />
      </label>
      <button
        onClick={generatePlan}
        disabled={loading}
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {loading ? "Generating..." : "Generate Meal Plan"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {plan.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Suggested Meal Plan</h3>
          <ul className="space-y-1">
            {plan.map((item, idx) => (
              <li key={idx}>
                {item.name} - {item.quantity} {item.unit} ({item.source})
                {item.source === "Buy" && ` - $${item.cost}`}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-semibold">Estimated Total Cost: ${totalCost}</p>
        </div>
      )}
    </div>
  );
}
