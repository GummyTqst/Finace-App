import prisma from "@/config/prisma";
// import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";
import { transporter } from "@/config/nodemailer";
import nodemailer from "nodemailer";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  // const body = await request.json();
  const { name, email, password } = await request.json();

  const validated = schema.safeParse({ name, email, password });
  if (!validated.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // const hash = await argon2.hash(validated.data.password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Nay" });
  }

  const info = await transporter.sendMail({
    from: '"Enterprise App" <info@enterpriseapp.com>',
    to: user.email,
    subject: "Aktiver din konto",
    text: `Klik her for at aktivere din konto: http://localhost:3300/auth/activation?activationstring=${btoa(user.id + ":" + user.activation_key)}`,
    html: `
            <h1>Velkommen til Enterprise</h1>
            <p>Du skal aktivere din konto før du kan fortsætte,</p>
            <p><a href="http://localhost:3300/auth/activation?activationstring=${btoa(user.id + ":" + user.activation_key)}">Klik her</a> for at aktivere din konto</p>
        `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("Preview URL: %s", previewUrl);

  return NextResponse.json({ message: "Yay" });

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
