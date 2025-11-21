"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Aisha Rahman",
      role: "Home Cook",
      text: "This app helped me cut my monthly food waste by nearly 40%. The expiry alerts are super accurate!",
      rating: 5,
    },
    {
      name: "Daniel Foster",
      role: "Fitness Enthusiast",
      text: "Meal planning became so much easier. The AI-generated meal plan keeps me within budget.",
      rating: 5,
    },
    {
      name: "Nadia Karim",
      role: "Mother of 3",
      text: "I used to forget what was in my fridge. Now I get reminders and save money every week!",
      rating: 4,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          What Our Users Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12">
          Real stories from people reducing waste and saving money.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* Rating */}
              <div className="flex justify-center mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                “{t.text}”
              </p>

              {/* User */}
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
