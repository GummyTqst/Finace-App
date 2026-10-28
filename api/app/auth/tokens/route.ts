// api : /app/auth/token/route.ts
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const validated = schema.safeParse({ email, password });

  if (!validated.success) {
    return NextResponse.json(
      {
        message: z.treeifyError(validated.error).properties,
      },
      { status: 403 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validated.data.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "incorrect email or password" },
      { status: 403 },
    );
  }

  const validPassword = await bcrypt.compare(
    validated.data.password,
    user.password,
  );

  if (!validPassword) {
    return NextResponse.json(
      { message: "incorrect email or password" },
      { status: 403 },
    );
  }

  const { TOKEN_SECRET } = process.env;

  if (!TOKEN_SECRET) throw new Error("no token secret");

  const token = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
    expiresIn: "5h",
  });
  const refreshToken = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
    expiresIn: "30d",
  });

  const savedRFToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
    },
  });

  console.log(savedRFToken);

  return NextResponse.json(
    {
      expiresIn: Date.now() + 5 * 60 * 60 * 1000,
      token,
      refreshToken: savedRFToken.id,
    },
    { status: 201 },
  );
}
