import formidable from "formidable";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const config = { api: { bodyParser: false } };

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, maxFileSize: 5*1024*1024 });
    form.parse(req, (err, fields, files) => err ? reject(err) : resolve({fields, files}));
  });
}

export default async function handler(req) {
  const db = await getDb();
  const collection = db.collection("projects");

  if (req.method === "GET") {
    const projects = await collection.find({}).sort({ premium:-1, createdAt:-1 }).toArray();
    return NextResponse.json({ success:true, projects });
  }

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);
      const { name, symbol, chain, contract, description, website, type } = fields;
      if (!name || !symbol) return NextResponse.json({ error:"name and symbol required" }, { status:400 });

      let logoBase64 = fields.logoBase64 || "";
      if (!logoBase64 && files?.logo) {
        const fs = require("fs");
        const buf = fs.readFileSync(files.logo.filepath);
        logoBase64 = `data:${files.logo.mimetype};base64,${buf.toString("base64")}`;
      }
      if (!logoBase64) return NextResponse.json({ error:"Logo required" }, { status:400 });

      const created = {
        name, symbol, chain: chain||"SOL", contract: contract||"", description: description||"", website: website||"",
        socialLinks: JSON.parse(fields.socialLinks||"{}"),
        createdAt: Date.now(),
        status: type==="premium"?"pending_payment":"pending_admin",
        premium: type==="premium",
        logoBase64,
        votes: 0,
        txid: fields.txid || null
      };

      const insert = await collection.insertOne(created);
      created._id = insert.insertedId;
      return NextResponse.json({ success:true, project: created });
    } catch(e) {
      console.error(e);
      return NextResponse.json({ error:e.message||String(e), status:500 });
    }
  }

  return NextResponse.json({ error:"Method not allowed", status:405 });
                     }
