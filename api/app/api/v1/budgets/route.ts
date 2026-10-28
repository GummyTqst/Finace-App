import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const budgetSchema = z.object({
  name: z.string().min(1).max(60),
  amount: z.coerce.number().positive(),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .default("#277c78"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(2100),
});

const budgetEditSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(60),
  amount: z.coerce.number().positive(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
})

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const month = Math.min(
    Math.max(
      Number(url.searchParams.get("month") ?? new Date().getMonth() + 1),
      1,
    ),
    12,
  );
  const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [budgets, monthExpenses] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: user.id, month, year },
      include: { category: true },
      orderBy: { amount: "desc" },
    }),
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "expense",
        date: { gte: start, lt: end },
      },
      select: { categoryId: true, amount: true },
    }),
  ]);

  const spentByCategory = new Map<string, number>();
  for (const t of monthExpenses) {
    if (!t.categoryId) continue;
    spentByCategory.set(
      t.categoryId,
      (spentByCategory.get(t.categoryId) ?? 0) + Number(t.amount),
    );
  }

  const rows = budgets.map((b) => {
    const spent = spentByCategory.get(b.categoryId) ?? 0;
    const amount = Number(b.amount);
    return {
      id: b.id,
      name: b.category.name,
      color: b.category.color,
      amount,
      spent,
      remaining: amount - spent,
      percentage: amount > 0 ? Math.round((spent / amount) * 100) : 0,
    };
  });

  return NextResponse.json({
    month,
    year,
    totalBudgeted: rows.reduce((s, r) => s + r.amount, 0),
    totalSpent: rows.reduce((s, r) => s + r.spent, 0),
    budgets: rows,
  });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = budgetSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid budget" }, { status: 400 });
  const category = await prisma.category.upsert({
    where: {
      id: `${user.id}-${parsed.data.name.toLowerCase().replace(/\s+/g, "-")}`,
    },
    update: { color: parsed.data.color },
    create: {
      id: `${user.id}-${parsed.data.name.toLowerCase().replace(/\s+/g, "-")}`,
      userId: user.id,
      name: parsed.data.name,
      color: parsed.data.color,
    },
  });
  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: user.id,
        categoryId: category.id,
        month: parsed.data.month,
        year: parsed.data.year,
      },
    },
    update: { amount: parsed.data.amount },
    create: {
      userId: user.id,
      categoryId: category.id,
      amount: parsed.data.amount,
      month: parsed.data.month,
      year: parsed.data.year,
    },
  });
  return NextResponse.json({ id: budget.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = budgetEditSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid budget" }, { status: 400 });
  }

  const existingBudget = await prisma.budget.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (!existingBudget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  const categoryId = `${user.id}-${parsed.data.name
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const category = await prisma.category.upsert({
    where: { id: categoryId },
    update: {
      color: parsed.data.color,
    },
    create: {
      id: categoryId,
      userId: user.id,
      name: parsed.data.name,
      color: parsed.data.color,
    },
  });

  const conflictingBudget = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      categoryId: category.id,
      month: existingBudget.month,
      year: existingBudget.year,
      id: { not: existingBudget.id },
    },
  });

  if (conflictingBudget) {
    return NextResponse.json(
      { error: "A budget already exists for this category" },
      { status: 409 },
    );
  }

  await prisma.budget.update({
    where: { id: existingBudget.id },
    data: {
      categoryId: category.id,
      amount: parsed.data.amount,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await requireUser(request);
  const { id } = await request.json();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.budget.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}