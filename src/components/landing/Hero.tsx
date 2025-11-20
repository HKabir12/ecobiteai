"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gsap } from "gsap";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section className="w-full ">
      <div
        ref={containerRef}
        className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-4xl md:text-5xl font-extrabold ">Eco</span>
          <span className="text-4xl md:text-5xl font-extrabold ">Bite</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight  max-w-3xl">
          Smart Food Management for a Sustainable Future
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl  mt-4 max-w-2xl">
          Track your food, reduce waste, save money, and support responsible
          consumption with real insights and mindful planning.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/api/auth/signin">
            <Button className="px-6 py-3 text-lg bg-green-600  hover:bg-green-700">
              Get Started
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="px-6 py-3 text-lg ">
              Learn More
            </Button>
          </Link>
        </div>

      
        {/* <div className="mt-14">
          <Image
            width={400}
            height={400}
            src="/hero-food.png" // replace with your own illustration
            alt="EcoBite sustainable food illustration"
            className="mx-auto w-[80%] md:w-[55%] drop-shadow-xl rounded-xl"
          />
        </div> */}
      </div>
    </section>
  );
}
