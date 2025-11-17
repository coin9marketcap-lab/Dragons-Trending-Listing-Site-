import { NextResponse } from "next/server";
import { getDb, verifyAdminToken } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function PATCH(req,{params}){
  const tokenData = verifyAdminToken(req);
  if(!tokenData) return NextResponse.json({error:"Unauthorized"}, {status:401});
  try {
    const {action} = await req.json();
    if(!["approve","reject"].includes(action)) return NextResponse.json({error:"Invalid action"}, {status:400});
    const db = await getDb
