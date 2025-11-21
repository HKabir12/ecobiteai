"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    {
      value: "40%",
      label: "Average Waste Reduced",
      description: "Users reduce food waste within the first month.",
    },
    {
      value: "$120+",
      label: "Monthly Savings",
      description: "Saved from fewer groceries wasted.",
    },
    {
      value: "12,500+",
      label: "Active Users",
      description: "Using AI-driven meal & waste tracking.",
    },
    {
      value: "3.2M+",
      label: "Items Tracked",
      description: "Real-time monitoring of user inventory.",
    },
  ];

  return (
    <section className="py-20 bg-green-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Making a Real Impact
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Our platform empowers users to cut waste, save money, and live more sustainably.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 border border-gray-100 dark:border-gray-700"
            >
              <motion.p
                className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {stat.value}
              </motion.p>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
