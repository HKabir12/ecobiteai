// app/api/nourishbot/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";

type Tip = { id: string; title: string; text: string };
type TipEmbedding = Tip & { embedding?: number[] };
type SessionMsg = { role: "system" | "user" | "assistant"; content: string; createdAt?: Date };

const TIPS_PATH = path.join(process.cwd(), "data", "nourish_tips.json");

// safe fetch wrapper
async function oaFetch(url: string, opts: RequestInit) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, status: res.status };
  }
}

// cosine similarity
function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
}

// generate session ID
function makeSessionId() {
  return crypto.randomBytes(12).toString("hex");
}

// OpenAI embedding
async function openaiEmbed(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  const body = JSON.stringify({ input: text, model });
  const res = await oaFetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body,
  });
  if ((res as any).error) throw new Error(JSON.stringify(res));
  return (res as any).data[0].embedding as number[];
}

// OpenAI chat completion
async function openaiChat(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

  const body = JSON.stringify({
    model,
    messages,
    temperature: 0.6,
    max_tokens: 900,
  });

  const res = await oaFetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body,
  });

  if ((res as any).error) throw new Error(JSON.stringify(res));
  return (res as any).choices?.[0]?.message?.content ?? "";
}

// ensure tips + embeddings exist
async function ensureTipsInDbAndEmbeddings(db: any) {
  const raw = fs.readFileSync(TIPS_PATH, "utf8");
  const tips: Tip[] = JSON.parse(raw);

  const tipsCol = db.collection<Tip>("nourish_tips");
  const embCol = db.collection<TipEmbedding>("nourish_tip_embeddings");

  // upsert tips
  for (const t of tips) {
    await tipsCol.updateOne({ id: t.id }, { $setOnInsert: t }, { upsert: true });
  }

  // check which tips need embeddings
  const missing = await embCol.find({ embedding: { $exists: false } }).toArray();
  const cursor = tipsCol.find();
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;
    const exists = await embCol.findOne({ id: doc.id });
    if (exists && exists.embedding) continue;

    try {
      const emb = await openaiEmbed(`${doc.title}\n\n${doc.text}`);
      await embCol.updateOne(
        { id: doc.id },
        { $set: { ...doc, embedding: emb } },
        { upsert: true }
      );
    } catch (e) {
      console.error("Embedding failed for tip", doc.id, e);
    }
  }
}

// build system prompt
function buildSystemPrompt(retrieved: Array<{ title: string; text: string }>) {
  const header = `You are NourishBot — an assistant focused on food-waste reduction, nutrition balancing, budget meal planning, transforming leftovers, local food sharing, and environmental impacts. Provide practical, empathetic, and safe guidance. If uncertain, suggest safe next steps (e.g., check expiry date or use smell/appearance tests).\n\n`;
  if (!retrieved || retrieved.length === 0) return header;

  const ctx = retrieved.map((r, i) => `Context ${i + 1} - ${r.title}:\n${r.text}`).join("\n\n");
  return `${header}Relevant tips (for grounding):\n${ctx}\n\nWhen appropriate, cite these tips in your answer.`;
}

// API POST handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId: incomingSessionId, message, userId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const db = await dbConnect();

    await ensureTipsInDbAndEmbeddings(db);

    const embCol = db.collection<TipEmbedding>("nourish_tip_embeddings");
    const tipsDocs = await embCol.find({}).toArray();

    const qEmb = await openaiEmbed(message);

    // compute cosine similarity
    const scored = tipsDocs.map(t => ({
      title: t.title,
      text: t.text,
      score: t.embedding ? cosine(qEmb, t.embedding) : 0,
    }));
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3).filter(s => s.score > 0);

    const systemPrompt = buildSystemPrompt(top);

    const sessCol = db.collection<{ sessionId: string; userId?: string | null; messages: SessionMsg[]; updatedAt: Date }>("nourish_sessions");
    let sessionId = incomingSessionId;

    if (!sessionId) {
      sessionId = makeSessionId();
      const initialMsgs: SessionMsg[] = [{ role: "system", content: systemPrompt, createdAt: new Date() }];
      await sessCol.insertOne({ sessionId, userId: userId || null, messages: initialMsgs, updatedAt: new Date() });
    } else {
      const existing = await sessCol.findOne({ sessionId });
      if (!existing) {
        const initialMsgs: SessionMsg[] = [{ role: "system", content: systemPrompt, createdAt: new Date() }];
        await sessCol.insertOne({ sessionId, userId: userId || null, messages: initialMsgs, updatedAt: new Date() });
      } else {
        const msgs: SessionMsg[] = existing.messages || [];
        if (!msgs.length || msgs[0].role !== "system") {
          msgs.unshift({ role: "system", content: systemPrompt, createdAt: new Date() });
        } else {
          msgs[0].content = systemPrompt;
          msgs[0].createdAt = new Date();
        }
        msgs.push({ role: "user", content: message, createdAt: new Date() });
        const limited = msgs.slice(-20);
        await sessCol.updateOne({ sessionId }, { $set: { messages: limited, updatedAt: new Date() } }, { upsert: true });
      }
    }

    const session = await sessCol.findOne({ sessionId });
    const messagesForModel = (session?.messages || []).map(m => ({ role: m.role, content: m.content }));

    const assistantReply = await openaiChat(messagesForModel);

    const now = new Date();
    await sessCol.updateOne(
      { sessionId },
      { $push: { messages: { role: "assistant", content: assistantReply, createdAt: now } }, $set: { updatedAt: now } },
      { upsert: true }
    );

    return NextResponse.json({ sessionId, reply: assistantReply, retrieved: top.map(t => ({ title: t.title, score: t.score })) });
  } catch (err: any) {
    console.error("NourishBot error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
