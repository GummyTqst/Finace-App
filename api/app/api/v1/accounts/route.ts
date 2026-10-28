import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const accountSchema = z.object({
  name: z.string().min(1).max(60),
  type: z.string().min(1),
  currency: z.string().length(3),
  balance: z.coerce.number(),
  institution: z.string().max(80).optional(),
  isLiability: z.boolean().optional().default(false),
})

export async function GET(request: NextRequest) {
  const user = await requireUser(request);

  if (!user)
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  
  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    accounts: accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      currency: account.currency,
      institution: account.institution,
      isLiability: account.isLiability,
    })),
  });
}


export async function POST(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  const parsed = accountSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid account" }, 
      { status: 400 }
    );
  }

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      currency: parsed.data.currency,
      balance: parsed.data.balance,
      institution: parsed.data.institution || null,
      isLiability: parsed.data.isLiability,
    },
  });

  return NextResponse.json(
    { id: account.id },
    { status: 201 }
  )
}


export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  const body = await request.json();

  if (body.action === "deposit") {
    const amount = Number(body.amount)

    if (!body.id || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request" }, 
        { status: 400 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        id: body.id,
        userId: user.id,
        isLiability: false,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" }, 
        { status: 404 }
      );
    }

    await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: { increment: amount },
      }
    });

    return NextResponse.json({ ok: true });
  }

  const parsed = accountSchema.partial().extend({ id: z.string().min(1), }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid account" }, 
      { status: 400 }
    );
  }

  const account = await prisma.account.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    }
  })

  if (!account) {
    return NextResponse.json(
      { error: "Account not found" }, 
      { status: 404 }
    );
  }

  await prisma.account.update({
    where: { id: account.id },
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      currency: parsed.data.currency,
      institution: parsed.data.institution || null,
      isLiability: parsed.data.isLiability,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const user = await requireUser(request);
  const body = await request.json();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const account = await prisma.account.findFirst({
    where: {
      id: body.id,
      userId: user.id,
    },
    include: {
      transactions: true,
    },
  });

  if (!account) {
    return NextResponse.json(
      { error: "Account not found" },
      { status: 404 },
    );
  }

  if (account.transactions.length > 0) {
    return NextResponse.json(
      {
        error:
          "This account cannot be deleted because it has transactions.",
      },
      { status: 409 },
    );
  }

  await prisma.account.delete({
    where: { id: account.id },
  });

  return NextResponse.json({ ok: true });
}
