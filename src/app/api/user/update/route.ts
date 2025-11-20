import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse incoming JSON body
    const data = await req.json();

    // Validate fields (basic)
    const { fullName, householdSize, dietaryPreferences, budget, location } =
      data;

    if (!fullName || !householdSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateFields: Record<string, any> = {
      fullName,
      householdSize: Number(householdSize),
      dietaryPreferences: dietaryPreferences || "",
      budget: budget ? Number(budget) : null,
      location: location || "",
      updatedAt: new Date(),
    };

    // Connect to DB
    const db = await dbConnect();
    const users = db.collection("users");

    // Update user document
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Update failed or no changes made" },
        { status: 400 }
      );
    }

    // Fetch updated user
    const updatedUser = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordHash: 0 } }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
