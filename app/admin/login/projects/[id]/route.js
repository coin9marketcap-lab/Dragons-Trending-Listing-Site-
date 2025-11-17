import { NextResponse } from "next/server";
import { getDb, verifyAdminToken } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  const tokenData = verifyAdminToken(req);
  if (!tokenData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectId = params.id;
  try {
    const body = await req.json();
    const { action } = body;
    if (!["approve", "reject"].includes(action))
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const db = await getDb();
    const update = action === "approve" ? { status: "approved" } : { status: "rejected" };
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      { $set: update }
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
