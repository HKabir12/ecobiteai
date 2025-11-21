"use client"
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import imgHero from "@/assets/images/EcoBite.png"

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto bg-white dark:bg-neutral-950 py-6">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-neutral-900 dark:text-white">
            Reduce Food Waste.
            <br /> Eat Smarter. Live Greener.
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-lg">
            EcoBite helps you track food usage, manage inventory, scan receipts,
            and reduce waste with intelligent insights. Save money and build
            sustainable habits effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md transition"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* IMAGE MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md">
            <Image
              src={imgHero}
              alt="EcoBite dashboard preview"
              width={600}
              height={500}
              className="rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
