"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [maxExpiration, setMaxExpiration] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const fetchItems = async () => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (maxExpiration) params.append("maxExpiration", maxExpiration);

    const res = await fetch(`/api/inventory?${params.toString()}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [category, maxExpiration]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Inventory</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option>Dairy</option>
          <option>Fruit</option>
          <option>Vegetable</option>
          <option>Meat</option>
          <option>Grain</option>
          <option>Beverage</option>
        </select>

        <Input
          type="number"
          placeholder="Max Expiration Days"
          value={maxExpiration}
          onChange={(e) => setMaxExpiration(e.target.value)}
          className="w-60"
        />
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <Card
            key={item._id}
            className="cursor-pointer hover:shadow-lg"
            onClick={() => setSelected(item)}
          >
            <CardContent className="p-4">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm">{item.category}</p>
              <p className="text-xs text-gray-500">
                Expires in {item.expirationDays} days
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-3">
            <h2 className="text-lg font-bold">{selected.name}</h2>
            <p>Category: {selected.category}</p>
            <p>Expiration: {selected.expirationDays} days</p>
            <p>Cost: ${selected.cost} per unit</p>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
