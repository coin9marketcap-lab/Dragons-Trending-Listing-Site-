import { NextResponse } from "next/server";
import { verifyAdmin, generateAdminToken } from "@/lib/utils";

export async function POST(req){
  const {username,password} = await req.json();
  if(!username||!password) return NextResponse.json({error:"Username and password required"}, {status:400});
  const isValid = await verifyAdmin(username,password);
  if(!isValid) return NextResponse.json({error:"Invalid credentials"}, {status:401});
  const token = generateAdminToken(username);
  return NextResponse.json({success:true,token});
}
