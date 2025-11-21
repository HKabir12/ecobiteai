// app/api/scan/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tesseract from "tesseract.js";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Advanced preprocessing
    const processedBuffer = await sharp(buffer)
      .resize({ width: 1024, withoutEnlargement: true }) // scale up small images
      .grayscale()                                      // convert to gray
      .normalize()                                      // enhance contrast
      .threshold(160)                                   // black & white (helps OCR)
      .rotate()                                         // auto-rotate if EXIF orientation
      .toBuffer();

    // Perform OCR
    const { data } = await Tesseract.recognize(processedBuffer, "eng", {
      logger: (m) => console.log("OCR progress:", m),
      config: {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-/:", // remove garbage
      },
    });

    // Split lines and clean text
    const lines = data.text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Map to structured items
    const parsedItems = lines.map((line) => ({
      name: line.replace(/[^a-zA-Z0-9\s\-,.:/]/g, ""), // remove remaining weird chars
      quantity: 1,
      unit: "",
      expiration: null,
    }));

    // Save to DB
    const db = await dbConnect();
    await db.collection("uploads").insertOne({
      userId,
      filename: file.name,
      parsedItems,
      createdAt: new Date(),
    });

    return NextResponse.json({ parsedItems });
  } catch (err: any) {
    console.error("Scan API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
