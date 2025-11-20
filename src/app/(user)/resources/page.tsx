"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url?: string;
}
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (type) params.append("type", type);

        const res = await fetch(`/api/resources?${params.toString()}`);
        const data = await res.json();

        setResources(data);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    loadResources();
  }, [category, type]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Sustainable Resources</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Waste Reduction">Waste Reduction</option>
          <option value="Budget Tips">Budget Tips</option>
          <option value="Meal Planning">Meal Planning</option>
          <option value="Storage Tips">Storage Tips</option>
          <option value="Nutrition">Nutrition</option>
        </select>

        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Article">Article</option>
          <option value="Video">Video</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((res) => (
          <Card key={res._id} className="hover:shadow-lg cursor-pointer">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold">{res.title}</h2>
              <p className="text-sm">{res.description}</p>

              <p className="text-xs text-gray-500">
                Category: {res.category} | Type: {res.type}
              </p>

              {res.url && (
                <a
                  href={res.url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Learn More
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
