// "use client"
// import React, { useEffect, useState } from "react";

// type Feature =
//   | "Food waste reduction"
//   | "Nutrition balancing"
//   | "Budget meal planning"
//   | "Leftover transformations"
//   | "Local food sharing"
//   | "Environmental impact";

// const SMALL_DATASET = [
//   { id: 1, tag: "leftover", text: "Use stale bread to make croutons or bread pudding." },
//   { id: 2, tag: "budget", text: "Cook large batches of beans — cheap, filling, and nutritious." },
//   { id: 3, tag: "waste", text: "Trim vegetable peels and freeze for stock." },
//   { id: 4, tag: "nutrition", text: "Add a handful of leafy greens to any soup for vitamins." },
//   { id: 5, tag: "sharing", text: "Use local community fridges or neighborhood groups to list extras." },
// ];

// const RULE_BASED_TIPS: Record<string, string[]> = {
//   "Food waste reduction": [
//     "Plan meals for the week and shop with a list.",
//     "Store food properly: herbs in damp paper, apples away from other produce.",
//     "Use FIFO: first in, first out in the fridge/pantry.",
//   ],
//   "Nutrition balancing": [
//     "Aim for half your plate to be vegetables/fruits.",
//     "Include a protein source at each meal (legumes, eggs, dairy, tofu, meat).",
//     "Swap refined carbs for whole grains where possible.",
//   ],
//   "Budget meal planning": [
//     "Choose in-season produce and frozen vegetables for savings.",
//     "Cook beans/lentils from dried instead of canned to save money.",
//   ],
// };

// // Simulated LLM reply
// function simulateLLMReply(systemPrompt: string, userPrompt: string, memory: string[]) {
//   const base = `${systemPrompt}\nUser asked: ${userPrompt}`;
//   const memoryPart = memory.length ? `\nSession memory highlights:\n- ${memory.join("\n- ")}` : "";

//   const picks = SMALL_DATASET.filter((d) => userPrompt.toLowerCase().includes(d.tag)).slice(0, 3);
//   const pickText = picks.length ? `\nRelevant tips from dataset:\n- ${picks.map((p) => p.text).join("\n- ")}` : "";

//   const ruleKeys = Object.keys(RULE_BASED_TIPS);
//   const ruleTipsText = ruleKeys
//     .map((k) => `${k}: ${RULE_BASED_TIPS[k].slice(0, 2).join("; ")}`)
//     .join("\n\n");

//   const reply = [
//     "Hi — here are practical suggestions based on your request:",
//     base,
//     memoryPart,
//     pickText,
//     "\nRule-based quick tips:",
//     ruleTipsText,
//   ]
//     .filter(Boolean)
//     .join("\n\n");

//   let tailored = "";
//   if (userPrompt.toLowerCase().includes("leftover") || userPrompt.toLowerCase().includes("leftovers")) {
//     tailored =
//       "Try turning leftovers into a bowl: mix grains, reheat vegetables, add a sauce and a fresh leaf — instant meal.";
//   }

//   return {
//     text: reply + (tailored ? "\n\n" + tailored : ""),
//     source: picks.map((p) => p.id),
//   };
// }

// export default function NourishBotDemo(): JSX.Element {
//   const [selectedFeature, setSelectedFeature] = useState<Feature>("Food waste reduction");
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
//   const [memory, setMemory] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [budget, setBudget] = useState<number>(5);

//   useEffect(() => {
//     const raw = localStorage.getItem("nourishbot_memory_v1");
//     if (raw) setMemory(JSON.parse(raw));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("nourishbot_memory_v1", JSON.stringify(memory));
//   }, [memory]);

//   function addToMemory(note: string) {
//     if (!note) return;
//     const next = [note, ...memory].slice(0, 20);
//     setMemory(next);
//   }

//   async function handleAsk() {
//     if (!input.trim()) return;
//     const userText = `${selectedFeature}: ${input.trim()}`;
//     setChat((c) => [...c, { role: "user", text: userText }]);
//     setLoading(true);

//     const systemPrompt =
//       "You are NourishBot — helpful assistant for food waste, nutrition, budget meals, leftovers, community sharing, and environmental impact. Keep replies practical and short. Use any session memory to personalize advice.";

//     await new Promise((r) => setTimeout(r, 400));
//     const result = simulateLLMReply(systemPrompt, userText, memory.slice(0, 5));

//     setChat((c) => [...c, { role: "assistant", text: result.text }]);
//     setLoading(false);
//     addToMemory(userText);
//     setInput("");
//   }

//   function quickTip(feature: Feature) {
//     const tips = RULE_BASED_TIPS[feature] || ["Try sharing extra through local groups."];
//     setChat((c) => [...c, { role: "assistant", text: `Quick tips for ${feature}:\n- ${tips.join("\n- ")}` }]);
//   }

//   function retrieveDataset(q: string) {
//     const found = SMALL_DATASET.filter((d) => d.text.toLowerCase().includes(q.toLowerCase()));
//     setChat((c) => [
//       ...c,
//       {
//         role: "assistant",
//         text: found.length ? `Found:\n- ${found.map((f) => f.text).join("\n- ")}` : "No direct dataset matches.",
//       },
//     ]);
//   }

//   function budgetPlan(budgetPerMeal: number) {
//     const options = [
//       { name: "Lentil stew + rice", cost: 0.8 },
//       { name: "Egg fried rice + greens", cost: 0.9 },
//       { name: "Bean curry + roti", cost: 0.6 },
//       { name: "Veg stir-fry + noodles", cost: 1.1 },
//     ];
//     const doable = options
//       .filter((o) => o.cost <= budgetPerMeal)
//       .map((o) => `${o.name} (est $${o.cost.toFixed(2)})`);

//     setChat((c) => [
//       ...c,
//       {
//         role: "assistant",
//         text: doable.length
//           ? `Budget options for $${budgetPerMeal} per meal:\n- ${doable.join("\n- ")}`
//           : `No options within $${budgetPerMeal}, try raising budget or using more staples.`,
//       },
//     ]);
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
//       <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-lg p-6">
//         <header className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-emerald-800">NourishBot</h1>
//             <p className="text-sm text-emerald-600">
//               Food-waste, nutrition, budget meals & leftover creativity — demo
//             </p>
//           </div>
//           <div className="text-right text-xs text-gray-500">Session memory: {memory.length} items</div>
//         </header>

//         <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <section className="col-span-2">
//             <div className="flex gap-2 mb-3">
//               <select
//                 className="p-2 rounded border"
//                 value={selectedFeature}
//                 onChange={(e) => setSelectedFeature(e.target.value as Feature)}
//               >
//                 {[
//                   "Food waste reduction",
//                   "Nutrition balancing",
//                   "Budget meal planning",
//                   "Leftover transformations",
//                   "Local food sharing",
//                   "Environmental impact",
//                 ].map((f) => (
//                   <option key={f}>{f}</option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 className="flex-1 p-2 rounded border"
//                 placeholder="Ask NourishBot something (e.g., 'what to do with leftover rice')"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleAsk()}
//               />

//               <button
//                 className="bg-emerald-600 text-white px-4 py-2 rounded"
//                 onClick={handleAsk}
//                 disabled={loading}
//               >
//                 {loading ? "Thinking..." : "Ask"}
//               </button>
//             </div>

//             <div className="space-y-3 max-h-[60vh] overflow-auto p-3 border rounded">
//               {chat.length === 0 && (
//                 <div className="text-sm text-gray-500">No messages yet — try a quick question or select a tip.</div>
//               )}
//               {chat.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`p-3 rounded ${
//                     m.role === "user" ? "bg-emerald-50 text-emerald-800 self-end" : "bg-gray-50 text-gray-800"
//                   }`}
//                 >
//                   <div className="text-xs text-gray-400">{m.role.toUpperCase()}</div>
//                   <div className="whitespace-pre-line">{m.text}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-3 flex gap-2">
//               <button className="px-3 py-2 rounded border text-sm" onClick={() => quickTip(selectedFeature)}>
//                 Quick tips
//               </button>
//               <button
//                 className="px-3 py-2 rounded border text-sm"
//                 onClick={() => retrieveDataset(selectedFeature.split(" ")[0])}
//               >
//                 Retrieve dataset
//               </button>
//               <button
//                 className="px-3 py-2 rounded border text-sm"
//                 onClick={() => {
//                   const lastUser = chat.slice().reverse().find((c) => c.role === "user");
//                   if (lastUser) addToMemory(lastUser.text);
//                 }}
//               >
//                 Save last user intent to memory
//               </button>
//             </div>
//           </section>

//           <aside className="p-3 border rounded">
//             <h3 className="font-semibold text-emerald-700 mb-2">Session memory</h3>
//             <div className="text-sm text-gray-700 mb-3">
//               Stored notes persist in your browser (localStorage). Use them to make NourishBot remember preferences.
//             </div>
//             <ul className="text-sm space-y-1 max-h-40 overflow-auto">
//               {memory.length === 0 && <li className="text-gray-400">No memory yet — add by saving a message</li>}
//               {memory.map((m, i) => (
//                 <li key={i} className="flex justify-between items-start gap-2">
//                   <span className="break-words">{m}</span>
//                   <button className="text-xs text-red-500" onClick={() => setMemory(memory.filter((_, idx) => idx !== i))}>
//                     remove
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-4">
//               <h4 className="font-medium">Budget meal planner</h4>
//               <div className="flex gap-2 items-center mt-2">
//                 <input
//                   type="range"
//                   min={0.5}
//                   max={5}
//                   step={0.1}
//                   value={budget}
//                   onChange={(e) => setBudget(Number(e.target.value))}
//                 />
//                 <div className="text-sm font-mono">${budget.toFixed(2)} / meal</div>
//               </div>
//               <button
//                 className="mt-2 w-full bg-emerald-600 text-white py-2 rounded text-sm"
//                 onClick={() => budgetPlan(budget)}
//               >
//                 Generate plans
//               </button>
//             </div>

//             <div className="mt-4">
//               <h4 className="font-medium">Small dataset (tips)</h4>
//               <div className="text-xs text-gray-600 mt-2">Search:</div>
//               <input
//                 className="w-full p-2 mt-1 rounded border text-sm"
//                 placeholder="e.g., leftover, budget"
//                 onKeyDown={(e) => e.key === "Enter" && retrieveDataset((e.target as HTMLInputElement).value)}
//               />
//             </div>

//             <div className="mt-4 text-xs text-gray-500">
//               Tips: This demo simulates an LLM. Replace the simulateLLMReply call with a server API that calls OpenAI/Hugging Face when you integrate with real credentials.
//             </div>
//           </aside>
//         </main>
//       </div>
//     </div>
//   );
// }
