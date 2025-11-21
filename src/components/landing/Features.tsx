"use client";

import { Lightbulb, Leaf, Refrigerator, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Lightbulb className="w-10 h-10 text-green-600" />,
      title: "Smart Consumption Insights",
      description:
        "Track your daily food usage and discover patterns to reduce waste and improve planning.",
    },
    {
      icon: <Leaf className="w-10 h-10 text-green-600" />,
      title: "Eco-Friendly Recommendations",
      description:
        "Get sustainable tips tailored to your budget, dietary needs, and lifestyle habits.",
    },
    {
      icon: <Refrigerator className="w-10 h-10 text-green-600" />,
      title: "Inventory Management",
      description:
        "Stay on top of what’s in your kitchen with expiration tracking and smart categorization.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-green-600" />,
      title: "Analytics & Progress",
      description:
        "Visualize your savings, reduced waste, and improvements over time with intuitive charts.",
    },
  ];

  return (
    <section className="py-6  dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold ">
          Everything You Need for Smarter Food Management
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
