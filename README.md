# Food Waste & SDG Impact Tracker

This project is a **client-side React/Next.js application** designed to help users track food consumption, inventory, waste reduction, and nutrition. It includes:

- **Basic rule-based tracking** of food logs and inventory.
- **Resource recommendations** based on logged items.
- **Heuristic SDG scoring engine** to assess weekly impact.
- **AI/ML-simulated waste estimation model** (formula-based and linear regression-based).
- **Interactive charts** for weekly and monthly trends.
- Fully **TailwindCSS-styled UI**.

---

## Features

1. **Food Logs & Inventory Tracking**
   - Log consumed items with quantity and category (Dairy, Vegetables, Fruits, Meat, Other).
   - Inventory auto-updates when a log is added.
   - Recent logs and inventory summary are shown.
   - Persistent storage in browser `localStorage`.

2. **Rule-Based Resource Recommendations**
   - Matches log categories to pre-defined recommendations.
   - Explains why each recommendation is shown.

3. **SDG Impact Scoring Engine (`SDGScore.tsx`)**
   - Scores weekly food choices based on waste reduction, nutrition, protein balance.
   - Provides actionable tips to improve scores.
   - Keeps history of last 12 weeks.
   - Interactive line chart shows trends.

4. **AI Waste Estimation (`AiWasteEstimation.tsx`)**
   - Predict weekly/monthly waste in grams.
   - Two methods: formula-based average and simulated ML predictor.
   - Shows monetary impact of waste.
   - Weekly history and comparison with community averages.

5. **Reusable Components**
   - Designed as modular React components.
   - Can be dropped into Next.js `pages/` or `app/` directories.

---

## Project Structure

