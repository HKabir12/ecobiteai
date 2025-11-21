"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Resource = {
  title: string;
  description: string;
  relatedTo: string;
};

type Log = {
  itemId: string;
  quantity: number;
  consumedAt: string;
};

export default function TrackingSummary() {
  const [totalItems, setTotalItems] = useState(0);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // while session loads
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // user not logged in
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Not authenticated</p>
      </div>
    );
  }

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tracking/summary?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setTotalItems(data.data.totalItems);
        setRecentLogs(data.data.recentLogs);
        setResources(data.data.recommendedResources);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchSummary();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tracking Summary</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* TOTAL ITEMS */}
          <p className="mb-4 font-semibold">
            Total items in inventory: {totalItems}
          </p>

          {/* RECENT LOGS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Recent Consumption Logs</h3>
            {recentLogs.length === 0 ? (
              <p>No recent consumption.</p>
            ) : (
              <ul className="space-y-1">
                {recentLogs.map((log) => (
                  <li key={log.itemId} className="text-gray-700">
                    {log.quantity} consumed on{" "}
                    {new Date(log.consumedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-semibold mb-2">Recommended Resources</h3>
            {resources.length === 0 ? (
              <p>No recommendations available.</p>
            ) : (
              <ul className="space-y-2">
                {resources.map((res, idx) => (
                  <li key={idx} className="p-3 border rounded-md bg-gray-50">
                    <p className="font-medium">{res.title}</p>
                    <p className="text-gray-700">{res.description}</p>
                    <p className="text-gray-500 text-sm">
                      Related to: {res.relatedTo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
