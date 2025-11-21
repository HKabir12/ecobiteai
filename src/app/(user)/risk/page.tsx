"use client";
import { useEffect, useState } from "react";

type Item = {
  _id: string;
  name: string;
  category: string;
  expirationDays: number;
  addedAt: string;
  risk: number;
  alert: string;
};

export default function InventoryRisk() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory/expiry-risk");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventory Expiration Risk</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm">Category: {item.category}</p>
              <p className="text-sm">
                Added: {new Date(item.addedAt).toLocaleDateString()}
              </p>
              <p
                className="text-sm font-bold"
                style={{
                  color:
                    item.risk >= 0.6
                      ? "red"
                      : item.risk >= 0.3
                      ? "orange"
                      : "green",
                }}
              >
                {item.alert} ({Math.round(item.risk * 100)}%)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
