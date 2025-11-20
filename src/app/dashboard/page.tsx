"use client";

import { useSession } from "next-auth/react";
import Tracking from "../(user)/tracking/page";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const userId = session?.user?.id; 

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  if (!session || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">
          Please login to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600">
          Welcome, {session.user.name}
        </h1>

        <Tracking userId={userId} />
      </div>
    </div>
  );
}
