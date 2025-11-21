"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="py-6  dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Q1 */}
          <AccordionItem
            value="item-1"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <AccordionTrigger>What is EcoBite?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              EcoBite is a smart sustainability assistant that helps users track
              food usage, reduce waste, and save money with actionable tips,
              inventory management, and personalized insights.
            </AccordionContent>
          </AccordionItem>

          {/* Q2 */}
          <AccordionItem
            value="item-2"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <AccordionTrigger>Is EcoBite free to use?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes! The core features—including inventory tracking, logging, and
              resources—are completely free.
            </AccordionContent>
          </AccordionItem>

          {/* Q3 */}
          <AccordionItem
            value="item-3"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <AccordionTrigger>Does EcoBite use AI?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes. EcoBite offers AI-powered insights, smarter recommendations,
              and food label scanning—but these advanced features come in later
              phases. Part 1 uses simple rule-based tracking.
            </AccordionContent>
          </AccordionItem>

          {/* Q4 */}
          <AccordionItem
            value="item-4"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <AccordionTrigger>
              Do I need to upload receipts or food labels?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Uploading is optional. You can upload images for storage, and
              later versions will automatically scan them for nutrition, expiry,
              and inventory suggestions.
            </AccordionContent>
          </AccordionItem>

          {/* Q5 */}
          <AccordionItem
            value="item-5"
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Absolutely. User data is securely stored, and EcoBite follows best
              practices for authentication and privacy using industry-standard
              methods.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
