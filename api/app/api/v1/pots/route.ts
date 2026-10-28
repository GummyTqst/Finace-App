import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const potSchema = z.object({
  name: z.string().min(1).max(60),
  targetAmount: z.coerce.number().positive(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#277c78"),
});

const potEditSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(60),
  targetAmount: z.coerce.number().positive(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#277c78"),
});

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pots = await prisma.goal.findMany({
    where: { userId: user.id },
    include: { contributions: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    pots: pots.map((pot) => ({
      id: pot.id,
      name: pot.name,
      targetAmount: Number(pot.targetAmount),
      saved: pot.contributions.reduce((sum, c) => sum + Number(c.amount), 0),
      color: pot.color,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = potSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid pot" }, { status: 400 });
  const colorInUse = await prisma.goal.findFirst({
    where: { userId: user.id, color: parsed.data.color },
  });
  if (colorInUse)
    return NextResponse.json({ error: "Pot color already in use" }, { status: 409 });
  const pot = await prisma.goal.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json({ id: pot.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  if (body.action === "edit") {
    const parsed = potEditSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid pot" }, { status: 400 });

    const pot = await prisma.goal.findFirst({
      where: { id: parsed.data.id, userId: user.id },
    });
    if (!pot)
      return NextResponse.json({ error: "Pot not found" }, { status: 404 });
    const colorInUse = await prisma.goal.findFirst({
      where: {
        userId: user.id,
        color: parsed.data.color,
        id: { not: pot.id },
      },
    });
    if (colorInUse)
      return NextResponse.json({ error: "Pot color already in use" }, { status: 409 });

    await prisma.goal.update({
      where: { id: pot.id },
      data: {
        name: parsed.data.name,
        targetAmount: parsed.data.targetAmount,
        color: parsed.data.color,
      },
    });
    return NextResponse.json({ ok: true });
  }

  const amount = Number(body.amount);
  if (
    !body.id ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !["add", "withdraw"].includes(body.action)
  )
    return NextResponse.json(
      { error: "Invalid contribution" },
      { status: 400 },
    );
  const pot = await prisma.goal.findFirst({
    where: { id: body.id, userId: user.id },
    include: { contributions: true },
  });
  if (!pot)
    return NextResponse.json({ error: "Pot not found" }, { status: 404 });
  const saved = pot.contributions.reduce((sum, c) => sum + Number(c.amount), 0);
  if (body.action === "withdraw" && amount > saved)
    return NextResponse.json(
      { error: "Not enough money in this pot" },
      { status: 400 },
    );
  if (
    body.action === "add" &&
    amount > Math.max(Number(pot.targetAmount) - saved, 0)
  )
    return NextResponse.json(
      { error: "Amount exceeds the remaining pot target" },
      { status: 400 },
    );
  const accounts = await prisma.account.findMany({
    where: { userId: user.id, isLiability: false },
    orderBy: { createdAt: "asc" },
  });
  const availableBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);
  if (body.action === "add" && amount > availableBalance)
    return NextResponse.json({ error: "Not enough money in total balance" }, { status: 400 });
  const primaryAccount = accounts[0];
  if (!primaryAccount)
    return NextResponse.json({ error: "No asset account found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    await tx.goalContribution.create({
      data: { goalId: pot.id, amount: body.action === "add" ? amount : -amount },
    });
    await tx.account.update({
      where: { id: primaryAccount.id },
      data: {
        balance: body.action === "add"
          ? { decrement: amount }
          : { increment: amount },
      },
    });
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.id || typeof body.id !== "string")
    return NextResponse.json({ error: "Invalid pot" }, { status: 400 });

  const pot = await prisma.goal.findFirst({
    where: { id: body.id, userId: user.id },
  });
  if (!pot)
    return NextResponse.json({ error: "Pot not found" }, { status: 404 });

  const saved = (await prisma.goalContribution.findMany({ where: { goalId: pot.id } }))
    .reduce((sum, contribution) => sum + Number(contribution.amount), 0);
  const primaryAccount = await prisma.account.findFirst({
    where: { userId: user.id, isLiability: false },
    orderBy: { createdAt: "asc" },
  });
  await prisma.$transaction(async (tx) => {
    if (primaryAccount && saved !== 0) {
      await tx.account.update({
        where: { id: primaryAccount.id },
        data: { balance: { increment: saved } },
      });
    }
    await tx.goalContribution.deleteMany({ where: { goalId: pot.id } });
    await tx.goal.delete({ where: { id: pot.id } });
  });
  return NextResponse.json({ ok: true });
}
