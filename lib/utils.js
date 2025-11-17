import jwt from "jsonwebtoken";

export async function verifyAdmin(username, password) {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export function generateAdminToken(username) {
  return jwt.sign({ username }, process.env.JWT_ADMIN_SECRET, { expiresIn: "24h" });
}

export function verifyAdminToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch {
    return null;
  }
}
