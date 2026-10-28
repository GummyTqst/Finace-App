import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const billSchema = z.object({
  name: z.string().min(1).max(80),
  amount: z.coerce.number().positive(),
  dueDay: z.coerce.number().int().min(1).max(31),
  category: z.string().max(60).optional(),
  account: z.string().max(60).optional(),
});

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bills = await prisma.recurringBill.findMany({
    where: { userId: user.id },
    orderBy: { dueDay: "asc" },
  });
  return NextResponse.json({
    bills: bills.map((bill) => ({ ...bill, amount: Number(bill.amount) })),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = billSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid bill" }, { status: 400 });
  const bill = await prisma.recurringBill.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json({ id: bill.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.id)
    return NextResponse.json({ error: "Bill id is required" }, { status: 400 });
  await prisma.recurringBill.updateMany({
    where: { id: body.id, userId: user.id },
    data: { active: Boolean(body.active) },
  });
  return NextResponse.json({ ok: true });
}
