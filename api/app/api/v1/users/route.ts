import prisma from "@/config/prisma";
// import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";
// import { transporter } from "@/config/nodemailer";
// import nodemailer from "nodemailer";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, password } = (body ?? {}) as Record<string, unknown>;

  const validated = schema.safeParse({ name, email, password });
  if (!validated.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validated.data.password, saltRounds);

    // const hash = await argon2.hash(validated.data.password)

    const user = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email.toLowerCase(),
        password: hashedPassword,
      },
    });

  // const info = await transporter.sendMail({
  //   from: '"Enterprise App" <info@enterpriseapp.com>',
  //   to: user.email,
  //   subject: "Aktiver din konto",
  //   text: `Klik her for at aktivere din konto: http://localhost:3300/auth/activation?activationstring=${btoa(user.id + ":" + user.activation_key)}`,
  //   html: `
  //           <h1>Velkommen til Enterprise</h1>
  //           <p>Du skal aktivere din konto før du kan fortsætte,</p>
  //           <p><a href="http://localhost:3300/auth/activation?activationstring=${btoa(user.id + ":" + user.activation_key)}">Klik her</a> for at aktivere din konto</p>
  //       `,
  // });

  // const previewUrl = nodemailer.getTestMessageUrl(info);
  // console.log("Preview URL: %s", previewUrl);

    return NextResponse.json({ message: "Yay" }, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    console.error("Could not create user", error);
    return NextResponse.json({ error: "Could not create the account right now" }, { status: 500 });
  }

  // try {
  //     const user = await prisma.user.create({
  //         data: {
  //             name,
  //             email,
  //             password,
  //         }
  //     });
  //     return NextResponse.json({ message: "yay", user }, { status: 201 });
  // } catch (error) {
  //     return NextResponse.json(
  //         { error: "Email already exists" },
  //         { status: 409 }
  //     );
  // }
}
