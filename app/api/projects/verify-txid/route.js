import { NextResponse } from "next/server";
import { getDb, verifyAdminToken } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const tokenData = verifyAdminToken(req);
  if(!tokenData) return NextResponse.json({error:"Unauthorized"}, {status:401});
  try {
    const body = await req.json();
    const { projectId, txid } = body;
    if(!projectId || !txid) return NextResponse.json({error:"projectId and txid required"}, {status:400});
    const db = await getDb();
    const project = await db.collection("projects").findOne({_id:new ObjectId(projectId)});
    if(!project) return NextResponse.json({error:"Project not found"}, {status:404});
    if(!project.premium) return NextResponse.json({error:"Not premium project"}, {status:400});
    await db.collection("projects").updateOne({_id:new ObjectId(projectId)}, {$set:{txid, status:"approved"}});
    return NextResponse.json({success:true});
  } catch(err){ return NextResponse.json({error:err.message||"Server error"}, {status:500}); }
}
