import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/config/prisma";

export async function requireUser(request: NextRequest) {
  const { TOKEN_SECRET } = process.env;
  if (!TOKEN_SECRET) throw new Error("no token secret");

  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ??
    request.cookies.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, TOKEN_SECRET) as { userId: string };
    return await prisma.user.findUnique({
      where: { id: payload.userId },
    });
  } catch {
    return null;
  }
}
