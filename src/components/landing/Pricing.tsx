"use client";

import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for everyday users getting started.",
      features: [
        "Track daily food consumption",
        "Basic inventory management",
        "Manual logging",
        "Access sustainability tips",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      description: "Ideal for users wanting deeper insights & smart planning.",
      features: [
        "Everything in Free",
        "Smart waste reduction recommendations",
        "Advanced analytics dashboard",
        "AI-powered meal suggestions",
        "Multi-household support",
      ],
      highlight: true,
    },
    {
      name: "Premium",
      price: "$19",
      description: "Best for eco-focused families and power users.",
      features: [
        "Everything in Pro",
        "Automated shopping list generation",
        "Expiry reminders & alerts",
        "Priority support",
        "Custom sustainability reports",
      ],
      highlight: false,
    },
  ];

  return (
    <section className="py-6  dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Choose the Right Plan for You
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Simple, transparent pricing. No hidden fees.
        </p>

        <div className="grid gap-8 md:grid-cols-3 mt-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border shadow-lg transition 
              ${
                plan.highlight
                  ? "bg-green-600 text-white scale-105"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-4xl font-extrabold mt-4">{plan.price}/mo</p>
              <p
                className={`mt-2 mb-6 ${
                  plan.highlight ? "text-green-100" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 ${
                        plan.highlight ? "text-white" : "text-green-600"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition 
                ${
                  plan.highlight
                    ? "bg-white text-green-700 hover:bg-gray-200"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
