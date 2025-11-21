"use client";

import React, { useState, useEffect } from "react";

type LogEntry = {
  id: string;
  date: string; // ISO
  item: string;
  category: "Dairy" | "Vegetables" | "Fruits" | "Meat" | "Other";
  quantity: number;
};

type InventoryItem = {
  id: string;
  name: string;
  category: "Dairy" | "Vegetables" | "Fruits" | "Meat" | "Other";
  quantity: number;
};

const RESOURCE_RECOMMENDATIONS: Record<
  LogEntry["category"],
  { title: string; description: string }[]
> = {
  Dairy: [
    {
      title: "Dairy Storage Tips",
      description: "Keep milk and cheese in the coldest part of the fridge.",
    },
  ],
  Vegetables: [
    {
      title: "Vegetable Freshness Tips",
      description:
        "Store leafy greens in airtight containers with paper towels.",
    },
  ],
  Fruits: [
    {
      title: "Fruit Ripening Tips",
      description:
        "Keep bananas separate; store berries in ventilated containers.",
    },
  ],
  Meat: [
    {
      title: "Meat Safety Guide",
      description: "Freeze raw meat if not used within 2 days.",
    },
  ],
  Other: [
    {
      title: "General Food Storage",
      description: "Label leftovers and consume within recommended times.",
    },
  ],
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newLog, setNewLog] = useState<{
    item: string;
    category: LogEntry["category"];
    quantity: number;
  }>({
    item: "",
    category: "Dairy",
    quantity: 1,
  });

  // load from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem("logs");
    const savedInventory = localStorage.getItem("inventory");
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [logs, inventory]);

  const addLog = () => {
    if (!newLog.item) return;
    const entry: LogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...newLog,
    };
    setLogs([entry, ...logs]);

    // update inventory
    const existing = inventory.find((i) => i.name === newLog.item);
    if (existing) {
      existing.quantity += newLog.quantity;
      setInventory([...inventory]);
    } else {
      setInventory([
        ...inventory,
        {
          id: entry.id,
          name: newLog.item,
          category: newLog.category,
          quantity: newLog.quantity,
        },
      ]);
    }

    setNewLog({ item: "", category: "Dairy", quantity: 1 });
  };

  const recentLogs = logs.slice(0, 5);

  const recommendations = logs
    .map((log) => RESOURCE_RECOMMENDATIONS[log.category] || [])
    .flat();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Food Logs & Inventory</h1>

        {/* Add new log */}
        <div className="p-4 bg-white rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">Add Consumption Log</h2>
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <input
              type="text"
              placeholder="Item name"
              value={newLog.item}
              onChange={(e) => setNewLog({ ...newLog, item: e.target.value })}
              className="border p-2 rounded w-full md:w-1/3"
            />
            <select
              value={newLog.category}
              onChange={(e) =>
                setNewLog({
                  ...newLog,
                  category: e.target.value as LogEntry["category"],
                })
              }
              className="border p-2 rounded md:w-1/4"
            >
              <option>Dairy</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Meat</option>
              <option>Other</option>
            </select>
            <input
              type="number"
              min={1}
              value={newLog.quantity}
              onChange={(e) =>
                setNewLog({ ...newLog, quantity: Number(e.target.value) })
              }
              className="border p-2 rounded md:w-1/6"
            />
            <button
              onClick={addLog}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Log
            </button>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="p-4 bg-white rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">Inventory Summary</h2>
          {inventory.length === 0 ? (
            <p className="text-gray-500">No items in inventory.</p>
          ) : (
            <ul className="list-disc pl-5">
              {inventory.map((i) => (
                <li key={i.id}>
                  {i.name} ({i.quantity} units) - Category: {i.category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Logs */}
        <div className="p-4 bg-white rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">Recent Logs</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500">No recent logs.</p>
          ) : (
            <ul className="list-disc pl-5">
              {recentLogs.map((log) => (
                <li key={log.id}>
                  {log.date.slice(0, 10)} - {log.item} ({log.quantity} units) -
                  Category: {log.category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-white rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">Resource Recommendations</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-500">No recommendations yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {recommendations.map((r, i) => (
                <li key={i}>
                  <strong>{r.title}</strong>: {r.description}{" "}
                  <span className="italic text-gray-500">
                    (Related to your logs)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
