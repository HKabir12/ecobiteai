"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-10   ">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Start Reducing Food Waste Today
        </h2>

        <p className="mt-4 text-lg ">
          Join thousands of users making smarter, greener, and more affordable food choices.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 border border-white/60 font-semibold rounded-xl hover:bg-white/10 transition"
          >
            Create Free Account
          </Link>

          <Link
            href="/resources"
            className="px-8 py-4 border border-white/60 font-semibold rounded-xl hover:bg-white/10 transition"
          >
            Explore Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
