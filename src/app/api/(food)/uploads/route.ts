import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const associatedItemId = formData.get("associatedItemId") as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: "File or userId missing" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG/PNG allowed" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const db = await dbConnect();

    await db.collection("uploads").insertOne({
      userId,
      filename: file.name,
      data: base64,
      mimetype: file.type,
      associatedItemId: associatedItemId || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
