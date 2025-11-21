// SDGScore.tsx
"use client"; // only needed if using Next.js 13+ app/ directory

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type WeekEntry = {
  id: string;
  date: string; // ISO
  wasteReductionPercent: number; // 0-100
  veggieServingsPerDay: number; // 0-10
  fruitServingsPerDay: number;
  processedMealsPerWeek: number; // lower is better
  proteinServingsPerDay: number;
  score: number; // 0-100
};

function clamp(v: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, v));
}

function computeScoreForEntry(e: Omit<WeekEntry, "id" | "date" | "score">): number {
  const weights = { waste: 0.35, nutrition: 0.55, protein: 0.1 };

  const wasteComponent = clamp(e.wasteReductionPercent, 0, 100) / 100;
  const veggieScore = clamp((e.veggieServingsPerDay / 5) * 100, 0, 100) / 100;
  const fruitScore = clamp((e.fruitServingsPerDay / 2) * 100, 0, 100) / 100;
  const processedPenalty = clamp((Math.max(0, e.processedMealsPerWeek - 3) / 14) * 100, 0, 100) / 100;
  const nutritionComponent = clamp(0.6 * veggieScore + 0.3 * fruitScore - 0.5 * processedPenalty, 0, 1);

  const proteinIdeal = 1.5;
  const proteinScore = clamp(1 - Math.abs(e.proteinServingsPerDay - proteinIdeal) / 2, 0, 1);

  const combined = weights.waste * wasteComponent + weights.nutrition * nutritionComponent + weights.protein * proteinScore;
  return Math.round(clamp(combined * 100, 0, 100));
}

function generateActionableSteps(entry: WeekEntry): string[] {
  const steps: string[] = [];

  if (entry.wasteReductionPercent < 50) steps.push("Focus on cutting single-use plastics and composting to raise waste reduction.");
  else if (entry.wasteReductionPercent < 80)
    steps.push("You're doing well on waste — try a bulk-buy plan or meal-prep to cut more food packaging.");
  else steps.push("Excellent waste reduction! Consider community sharing or repair events to amplify impact.");

  if (entry.veggieServingsPerDay < 3) steps.push("Add one extra vegetable serving at lunch or dinner to boost your nutrition score.");
  if (entry.fruitServingsPerDay < 1) steps.push("Add a fruit as a snack to improve micronutrients.");
  if (entry.processedMealsPerWeek > 5) steps.push("Replace one processed meal per day with a home-cooked option.");
  if (entry.proteinServingsPerDay < 1) steps.push("Include a moderate protein source (legumes, eggs, fish) to balance meals.");

  return steps.length ? steps : ["Keep following your routine — small changes add up."];
}

export default function SDGScore(): JSX.Element {
  const [wasteReductionPercent, setWasteReductionPercent] = useState<number>(40);
  const [veggieServingsPerDay, setVeggieServingsPerDay] = useState<number>(2);
  const [fruitServingsPerDay, setFruitServingsPerDay] = useState<number>(1);
  const [processedMealsPerWeek, setProcessedMealsPerWeek] = useState<number>(4);
  const [proteinServingsPerDay, setProteinServingsPerDay] = useState<number>(1);
  const [history, setHistory] = useState<WeekEntry[]>([]);

  const currentScore = computeScoreForEntry({
    wasteReductionPercent,
    veggieServingsPerDay,
    fruitServingsPerDay,
    processedMealsPerWeek,
    proteinServingsPerDay,
  });

  useEffect(() => {
    const raw = localStorage.getItem("sdg_history_v1");
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sdg_history_v1", JSON.stringify(history));
  }, [history]);

  function saveWeek() {
    const entry: WeekEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      wasteReductionPercent,
      veggieServingsPerDay,
      fruitServingsPerDay,
      processedMealsPerWeek,
      proteinServingsPerDay,
      score: currentScore,
    };
    setHistory((h) => [entry, ...h].slice(0, 12));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("sdg_history_v1");
  }

  const insights = (() => {
    if (!history.length) return ["No previous weeks saved — save this week to get trend insights."];
    const diff = currentScore - history[0].score;
    if (diff > 5) return [`Great improvement since last saved week (+${diff} pts).`];
    if (diff < -5) return [`Score fell by ${Math.abs(diff)} pts since last saved week.`];
    return [`Score change is stable since last saved week (${diff} pts).`];
  })();

  const actions = generateActionableSteps({
    id: "current",
    date: new Date().toISOString(),
    wasteReductionPercent,
    veggieServingsPerDay,
    fruitServingsPerDay,
    processedMealsPerWeek,
    proteinServingsPerDay,
    score: currentScore,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-900">SDG Impact Scoring Engine</h1>
          <p className="text-sm text-green-700">Personal SDG Score, weekly insights, and actionable next steps</p>
        </header>

        {/* Input Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Input — This Week</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Waste reduction (%)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wasteReductionPercent}
                  onChange={(e) => setWasteReductionPercent(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-600">{wasteReductionPercent}% reduced waste</div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Vegetable servings/day</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={veggieServingsPerDay}
                  onChange={(e) => setVeggieServingsPerDay(Number(e.target.value))}
                  className="mt-1 block w-28 rounded border px-2 py-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Fruit servings/day</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={fruitServingsPerDay}
                  onChange={(e) => setFruitServingsPerDay(Number(e.target.value))}
                  className="mt-1 block w-28 rounded border px-2 py-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Processed meals/week</span>
                <input
                  type="number"
                  min={0}
                  max={21}
                  value={processedMealsPerWeek}
                  onChange={(e) => setProcessedMealsPerWeek(Number(e.target.value))}
                  className="mt-1 block w-28 rounded border px-2 py-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Protein servings/day</span>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={proteinServingsPerDay}
                  onChange={(e) => setProteinServingsPerDay(Number(e.target.value))}
                  className="mt-1 block w-28 rounded border px-2 py-1"
                />
              </label>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={saveWeek}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
                >
                  Save this week
                </button>
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Clear history
                </button>
              </div>
            </div>
          </div>

          {/* Score & Actions */}
          <aside className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">Personal SDG Score</h3>
              <div className="mt-3 flex items-end gap-4">
                <div className="text-5xl font-extrabold text-green-700">{currentScore}</div>
                <div className="text-sm text-gray-600">/100</div>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {currentScore >= 75
                  ? "Excellent — positively impacting SDG goals!"
                  : currentScore >= 50
                  ? "Good — small improvements will push you higher."
                  : "Starting out — focus on actionable changes below."}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-800">Quick actions</h4>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                {actions.slice(0, 4).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* Insights & Chart */}
        <section className="mb-6 bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Weekly insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Latest insights</h3>
              <ul className="mt-2 list-disc list-inside text-gray-700">
                {insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Trend (last saved weeks)</h3>
              <div className="h-48">
                {history.length ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={[...history].reverse().map((h) => ({
                        date: new Date(h.date).toLocaleDateString(),
                        score: h.score,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-500">No history yet — save a week to populate the chart.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Saved weeks */}
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Saved weeks</h2>
          {history.length === 0 ? (
            <div className="text-sm text-gray-500 mt-2">No entries yet.</div>
          ) : (
            <div className="mt-3 space-y-3">
              {history.map((h) => (
                <div key={h.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{new Date(h.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">
                      Score: {h.score} — Waste {h.wasteReductionPercent}% — Veg: {h.veggieServingsPerDay}/day
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{generateActionableSteps(h)[0]}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-6 text-sm text-gray-600">
          <p>
            Notes: This demo uses a client-side heuristic to simulate an AI scoring engine. For production, send
            input to a server-side model and store history in a backend database.
          </p>
        </footer>
      </div>
    </main>
  );
}
