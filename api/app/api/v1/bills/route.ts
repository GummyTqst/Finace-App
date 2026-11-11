import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { nextDueDate } from "@/lib/recurring-bills";

const billSchema = z.object({
  name: z.string().min(1).max(80),
  amount: z.coerce.number().positive(),
  dueDay: z.coerce.number().int().min(1).max(31),
  category: z.string().max(60).optional(),
  account: z.string().max(60).optional(),
  accountId: z.string().min(1),
  categoryId: z.string().min(1).optional(),
  autoCreate: z.coerce.boolean().optional().default(false),
});

const billEditSchema = billSchema.extend({ id: z.string().min(1) });

async function validateLinks(userId: string, accountId: string, categoryId?: string) {
  const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!account) return { error: "Account not found" } as const;

  let category = null;
  if (categoryId) {
    category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!category) return { error: "Category not found" } as const;
  }

  return { account, category } as const;
}

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bills = await prisma.recurringBill.findMany({
    where: { userId: user.id },
    orderBy: { dueDay: "asc" },
  });

  return NextResponse.json({
    currency: user.currency ?? "EUR",
    bills: bills.map((bill) => ({ ...bill, amount: Number(bill.amount) })),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = billSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid bill" }, { status: 400 });

  const links = await validateLinks(user.id, parsed.data.accountId, parsed.data.categoryId);
  if ("error" in links) return NextResponse.json({ error: links.error }, { status: 404 });

  const bill = await prisma.recurringBill.create({
    data: {
      ...parsed.data,
      account: links.account.name,
      category: links.category?.name ?? null,
      nextDueDate: nextDueDate(parsed.data.dueDay),
      userId: user.id,
    },
  });

  return NextResponse.json({ id: bill.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const bill = await prisma.recurringBill.findFirst({ where: { id, userId: user.id } });
  if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

  if (body.action === "toggle") {
    await prisma.recurringBill.update({ where: { id }, data: { active: Boolean(body.active) } });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "edit") {
    const parsed = billEditSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid bill" }, { status: 400 });
    const links = await validateLinks(user.id, parsed.data.accountId, parsed.data.categoryId);
    if ("error" in links) return NextResponse.json({ error: links.error }, { status: 404 });

    await prisma.recurringBill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        amount: parsed.data.amount,
        dueDay: parsed.data.dueDay,
        category: links.category?.name ?? null,
        account: links.account.name,
        accountId: parsed.data.accountId,
        categoryId: parsed.data.categoryId || null,
        autoCreate: parsed.data.autoCreate,
        nextDueDate: nextDueDate(parsed.data.dueDay),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "pay") {
    if (!bill.accountId) return NextResponse.json({ error: "Link an account before marking this bill as paid" }, { status: 400 });
    const now = new Date();
    if (bill.lastPaidDate && bill.lastPaidDate.getFullYear() === now.getFullYear() && bill.lastPaidDate.getMonth() === now.getMonth()) {
      return NextResponse.json({ error: "This bill is already marked as paid this month" }, { status: 409 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: bill.accountId!,
          categoryId: bill.categoryId,
          type: "expense",
          description: bill.name,
          amount: bill.amount,
          date: now,
          recurringId: bill.id,
        },
      });
      await tx.account.update({ where: { id: bill.accountId! }, data: { balance: { decrement: bill.amount } } });
      await tx.recurringBill.update({
        where: { id },
        data: { lastPaidDate: now, nextDueDate: nextDueDate(bill.dueDay, new Date(now.getFullYear(), now.getMonth() + 1, 1)) },
      });
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid bill action" }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (typeof body.id !== "string") return NextResponse.json({ error: "Bill id is required" }, { status: 400 });
  const result = await prisma.recurringBill.deleteMany({ where: { id: body.id, userId: user.id } });
  if (result.count === 0) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
