import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Connect to DB
    const db = await dbConnect();
    const users = db.collection("users");

    // Fetch user details
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          passwordHash: 0, // hide password
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
