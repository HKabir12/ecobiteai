"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  expirationDays: number;
  cost: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [category, setCategory] = useState("");
  const [maxExpiration, setMaxExpiration] = useState("");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch inventory from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (maxExpiration) params.append("maxExpiration", maxExpiration);

        const res = await fetch(`/api/inventory?${params.toString()}`);
        const data = await res.json();

        // Ensure data is always an array
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, maxExpiration]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold ">Inventory</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 dark:text-black">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-64 dark:text-black"
        >
          <option value="">All Categories</option>
          <option value="Dairy">Dairy</option>
          <option value="Fruit">Fruit</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Meat">Meat</option>
          <option value="Grain">Grain</option>
          <option value="Beverage">Beverage</option>
        </select>

        <Input
          type="number"
          placeholder="Max Expiration Days"
          value={maxExpiration}
          onChange={(e) => setMaxExpiration(e.target.value)}
          className="w-full sm:w-60"
        />
      </div>

      {/* Loading / Error */}
      {loading && <p className="">Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Inventory Grid */}
      {!loading && !error && items.length === 0 && (
        <p className="">No items found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelected(item)}
          >
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm ">{item.category}</p>
              <p className="text-xs ">
                Expires in {item.expirationDays} days
              </p>
              <p className="text-sm ">Cost: ${item.cost}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 space-y-3 shadow-lg">
            <h2 className="text-xl font-bold dark:text-black">{selected.name}</h2>
            <p className="dark:text-black">Category: {selected.category}</p>
            <p className="dark:text-black">Expires in: {selected.expirationDays} days</p>
            <p className="dark:text-black">Cost: ${selected.cost} per unit</p>

            <button
              className="bg-red-500  px-4 py-2 rounded w-full hover:bg-red-600 transition-colors"
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
