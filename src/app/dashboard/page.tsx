"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Loading screen
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Not logged in
  if (!session || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Please login to access the dashboard.</p>
      </div>
    );
  }

  // Dummy DATA (FULLY WORKING)
  const dummyData = {
    totalItems: 12,
    expiringSoon: 3,
    totalSpent: 45.75,
    sdgScore: 82,
    wastePerDay: [
      { _id: "2025-01-10", wasted: 120 },
      { _id: "2025-01-11", wasted: 80 },
      { _id: "2025-01-12", wasted: 150 },
      { _id: "2025-01-13", wasted: 95 },
    ],
  };

  useEffect(() => {
    // simulate backend delay
    setTimeout(() => {
      setStats(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !stats) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // Chart data
  const chartData = {
    labels: stats.wastePerDay.map((x: any) => x._id),
    datasets: [
      {
        label: "Daily Waste (grams)",
        data: stats.wastePerDay.map((x: any) => x.wasted),
        borderWidth: 2,
        borderColor: "rgb(34,197,94)", // green-500
        backgroundColor: "rgba(34,197,94,0.3)",
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {session.user.name}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Items</h2>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Expiring Soon</h2>
          <p className="text-2xl font-bold">{stats.expiringSoon}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold text-gray-600">Total Spent</h2>
          <p className="text-2xl font-bold">${stats.totalSpent}</p>
        </div>
      </div>

      {/* SDG Score */}
      <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded mb-6">
        <h2 className="text-xl font-semibold">SDG Impact Score</h2>
        <p className="text-4xl font-bold text-green-700">{stats.sdgScore}</p>
      </div>

      {/* Waste Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Waste Trend</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}
