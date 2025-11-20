"use client";

import { useEffect, useState } from "react";

export default function Tracking({ userId }: { userId: string }) {
  const [tracking, setTracking] = useState<any>(null);

  const fetchTracking = async () => {
    const res = await fetch(`/api/tracking?userId=${userId}`);
    const data = await res.json();
    setTracking(data);
  };

  useEffect(() => {
    fetchTracking();
  }, [userId]);

  if (!tracking) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Food Tracking Summary</h2>

      <div>
        <p>Total Inventory Items: {tracking.summary.totalItems}</p>
        <p>Items Expiring Soon: {tracking.summary.expiringSoonCount}</p>
        <p>Recent Logs (7 days): {tracking.summary.recentLogsCount}</p>
      </div>

      <h3 className="text-xl font-semibold mt-4">Expiring Soon</h3>
      <ul className="list-disc ml-6">
        {tracking.expiringSoon.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} pcs
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Recent Consumption Logs</h3>
      <ul className="list-disc ml-6">
        {tracking.recentLogs.map((log) => (
          <li key={log._id}>
            {log.itemName} ({log.quantity}) -{" "}
            {new Date(log.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Recommended Resources</h3>
      <ul className="list-disc ml-6">
        {tracking.recommendations.map((res) => (
          <li key={res._id}>
            <a
              href={res.url}
              target="_blank"
              className="text-blue-600 underline"
            >
              {res.title}
            </a>{" "}
            - {res.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
