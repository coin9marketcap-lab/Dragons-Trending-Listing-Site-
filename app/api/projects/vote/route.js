import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if(!id) return NextResponse.json({error:"Project ID required"}, {status:400});
  try {
    const db = await getDb();
    const result = await db.collection("projects").updateOne({_id:new ObjectId(id)}, {$inc:{votes:1}});
    if(result.matchedCount===0) return NextResponse.json({error:"Project not found"}, {status:404});
    return NextResponse.json({success:true});
  } catch(err) { return NextResponse.json({error:err.message||"Server error"}, {status:500}); }
      }
