import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      fullName,
      email,
      password,
      householdSize,
      dietaryPreferences,
      location,
    } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await dbConnect();
    const users = db.collection("users");

    const existing = await users.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await users.insertOne({
      fullName,
      email,
      passwordHash: hashed,
      householdSize: Number(householdSize),
      dietaryPreferences,
      location,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
