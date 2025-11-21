"use client";

import { motion } from "framer-motion";
import { CheckCircle, Camera, Bell, Leaf } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="w-10 h-10 text-green-600" />,
      title: "Scan or Add Your Food Items",
      description:
        "Quickly scan receipts or manually add items to track expiration dates and quantities with ease.",
    },
    {
      icon: <Bell className="w-10 h-10 text-green-600" />,
      title: "Get Smart Alerts",
      description:
        "Receive notifications before food expires so you can use items while they’re still fresh.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      title: "Track Your Usage",
      description:
        "Monitor consumption, spending, and waste to understand your habits and improve efficiency.",
    },
    {
      icon: <Leaf className="w-10 h-10 text-green-600" />,
      title: "Save Money & Reduce Waste",
      description:
        "Our AI helps you optimize meals, cut waste, and contribute to a more sustainable planet.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12">
          Reduce waste and save money with a simple, smart, and transparent process.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
