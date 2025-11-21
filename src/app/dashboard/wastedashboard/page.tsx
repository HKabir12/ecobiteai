"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

type WasteEvent = {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  grams: number;
};

const DUMMY_COMMUNITY = [
  { weekLabel: "W1", avgGrams: 1200 },
  { weekLabel: "W2", avgGrams: 1100 },
  { weekLabel: "W3", avgGrams: 1300 },
  { weekLabel: "W4", avgGrams: 1250 },
];

function formatMoney(amount: number) {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function AiWasteEstimation() {
  const [events, setEvents] = useState<WasteEvent[]>(() => {
    const now = new Date();
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (13 - i));
      return {
        id: `e${i}`,
        date: d.toISOString().slice(0, 10),
        grams: Math.round(200 + Math.random() * 600),
      };
    });
  });

  const [costPerGram, setCostPerGram] = useState<number>(0.01); // default $0.01 per gram
  const [method, setMethod] = useState<"formula" | "ml">("formula");

  // Simple predictive formula: average daily waste
  const simplePrediction = useMemo(() => {
    const total = events.reduce((s, e) => s + e.grams, 0);
    const days = new Set(events.map((e) => e.date)).size || 1;
    const avgDaily = total / days;
    return { avgDaily, weekly: avgDaily * 7, monthly: avgDaily * 30 };
  }, [events]);

  // Simulated ML prediction (linear regression)
  const mlPrediction = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((e, i) => {
      xs.push(i);
      ys.push(e.grams);
    });
    const n = xs.length;
    if (n === 0) return { weekly: 0, monthly: 0, avgDaily: 0 };
    const xMean = xs.reduce((a, b) => a + b, 0) / n;
    const yMean = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - xMean) * (ys[i] - yMean);
      den += (xs[i] - xMean) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;
    const nextThirty = Array.from({ length: 30 }).map((_, k) =>
      Math.max(0, intercept + slope * (n + k))
    );
    const monthly = nextThirty.reduce((s, v) => s + v, 0);
    const weekly = nextThirty.slice(0, 7).reduce((s, v) => s + v, 0);
    const avgDaily = monthly / 30;
    return { weekly, monthly, avgDaily };
  }, [events]);

  const chosen = method === "formula" ? simplePrediction : mlPrediction;

  // Weekly breakdown for last 4 weeks
  const weeklyGrouped = useMemo(() => {
    const now = new Date();
    const buckets: { label: string; grams: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      const end = new Date(now);
      end.setDate(now.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      const label = `${start.toISOString().slice(5, 10)} → ${end
        .toISOString()
        .slice(5, 10)}`;
      const grams = events
        .filter((e) => {
          const d = new Date(e.date + "T00:00:00");
          return d >= start && d <= end;
        })
        .reduce((s, e) => s + e.grams, 0);
      buckets.push({ label, grams });
    }
    return buckets;
  }, [events]);

  const communityComparison = useMemo(() => {
    const userWeekly = chosen.weekly;
    const communityAvg =
      DUMMY_COMMUNITY.reduce((s, c) => s + c.avgGrams, 0) /
      DUMMY_COMMUNITY.length;
    return { userWeekly, communityAvg };
  }, [chosen]);

  const moneyWeekly = chosen.weekly * costPerGram;
  const moneyMonthly = chosen.monthly * costPerGram;

  const addRandomEvent = () => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 14));
    const newEvent: WasteEvent = {
      id: Math.random().toString(36).slice(2, 9),
      date: d.toISOString().slice(0, 10),
      grams: Math.round(100 + Math.random() * 800),
    };
    setEvents((s) => [...s, newEvent]);
  };

  const clearEvents = () => setEvents([]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">AI Waste Estimation Model</h1>
          <div className="space-x-2">
            <button
              onClick={addRandomEvent}
              className="px-3 py-1 rounded bg-indigo-600 text-white"
            >
              Add random event
            </button>
            <button
              onClick={clearEvents}
              className="px-3 py-1 rounded bg-rose-500 text-white"
            >
              Clear events
            </button>
          </div>
        </header>

        {/* Settings */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white shadow">
            <h2 className="font-medium">Data & Settings</h2>
            <label className="block mt-3 text-sm">Cost per gram (USD)</label>
            <input
              type="number"
              step="0.001"
              value={costPerGram}
              onChange={(e) => setCostPerGram(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded border p-2"
            />

            <label className="block mt-3 text-sm">Method</label>
            <div className="mt-1 space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={method === "formula"}
                  onChange={() => setMethod("formula")}
                />
                <span className="ml-2">Simple formula</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={method === "ml"}
                  onChange={() => setMethod("ml")}
                />
                <span className="ml-2">ML predictive (simulated)</span>
              </label>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <div>
                Events recorded: <strong>{events.length}</strong>
              </div>
              <div>
                Avg daily (chosen method):{" "}
                <strong>{Math.round(chosen.avgDaily)} g</strong>
              </div>
            </div>
          </div>

          {/* Weekly & Monthly projections */}
          <div className="col-span-2 p-4 rounded-xl bg-white shadow">
            <h2 className="font-medium">Weekly & Monthly Projections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 rounded bg-slate-50">
                <div className="text-sm text-slate-500">
                  Projected weekly waste
                </div>
                <div className="text-xl font-semibold">
                  {Math.round(chosen.weekly)} g
                </div>
                <div className="text-sm">{formatMoney(moneyWeekly)} / week</div>
              </div>

              <div className="p-3 rounded bg-slate-50">
                <div className="text-sm text-slate-500">
                  Projected monthly waste (30d)
                </div>
                <div className="text-xl font-semibold">
                  {Math.round(chosen.monthly)} g
                </div>
                <div className="text-sm">
                  {formatMoney(moneyMonthly)} / month
                </div>
              </div>

              <div className="p-3 rounded bg-slate-50">
                <div className="text-sm text-slate-500">
                  Community avg (weekly)
                </div>
                <div className="text-xl font-semibold">
                  {Math.round(communityComparison.communityAvg)} g
                </div>
                <div className="text-sm">
                  Your weekly vs community:{" "}
                  <strong>
                    {Math.round(
                      (chosen.weekly / communityComparison.communityAvg) * 100
                    )}
                    %
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white shadow">
            <h3 className="font-medium mb-3">Weekly history (last 4 weeks)</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyGrouped}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v: any) => `${Math.round(v)} g`} />
                  <Bar dataKey="grams" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white shadow">
            <h3 className="font-medium mb-3">
              Projection comparison (30 days)
            </h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "You (proj)", value: chosen.monthly },
                    {
                      name: "Community (approx)",
                      value:
                        (DUMMY_COMMUNITY.reduce((s, c) => s + c.avgGrams, 0) /
                          DUMMY_COMMUNITY.length) *
                        4,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: any) => `${Math.round(v)} g`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Events table */}
        <section className="p-4 rounded-xl bg-white shadow mb-6">
          <h3 className="font-medium mb-3">Events (editable demo)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-600">
                <tr>
                  <th>Date</th>
                  <th>Grams</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="py-2">{e.date}</td>
                      <td className="py-2">{e.grams} g</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-sm text-slate-500">
          Implementation includes simple predictive formulas (average-based) and
          a simulated ML predictor (linear regression). Use the "Add random
          event" button to see live changes.
        </footer>
      </div>
    </div>
  );
}
