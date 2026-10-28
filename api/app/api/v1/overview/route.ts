import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [accounts, budgets, recentTransactions, monthTransactions, goals] =
    await Promise.all([
      prisma.account.findMany({ where: { userId: user.id } }),
      prisma.budget.findMany({
        where: { userId: user.id, month, year },
        include: { category: true },
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        include: { account: true, category: true },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.transaction.findMany({
        where: { userId: user.id, date: { gte: start, lte: end } },
        select: { amount: true, type: true, categoryId: true },
      }),
      prisma.goal.findMany({
        where: { userId: user.id },
        include: { contributions: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const spentByCategory = new Map<string, number>();
  for (const t of monthTransactions) {
    if (t.type !== "expense" || !t.categoryId) continue;
    spentByCategory.set(
      t.categoryId,
      (spentByCategory.get(t.categoryId) ?? 0) + Number(t.amount),
    );
  }

  const totalBalance = accounts
    .filter((a) => !a.isLiability)
    .reduce((sum, a) => sum + Number(a.balance), 0);
  const pots = goals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    saved: goal.contributions.reduce(
      (sum, contribution) => sum + Number(contribution.amount),
      0,
    ),
    color: goal.color,
  }));
  const potsTotal = pots.reduce((sum, pot) => sum + pot.saved, 0);

  return NextResponse.json({
    totalBalance,
    income,
    expenses,
    potsTotal,
    potsPreview: pots.slice(0, 4),
    accounts: accounts.map((account) => ({
      id: account.id,
      name: account.name,
      balance: Number(account.balance),
      isLiability: account.isLiability,
    })),
    budgetSummary: budgets.map((b) => ({
      id: b.id,
      name: b.category.name,
      color: b.category.color,
      amount: Number(b.amount),
      spent: spentByCategory.get(b.categoryId) ?? 0,
    })),
    recentTransactions: recentTransactions.map((t) => ({
      id: t.id,
      description: t.description,
      amount: Number(t.amount),
      type: t.type,
      date: t.date,
      category: t.category?.name ?? "Uden kategori",
      categoryColor: t.category?.color ?? "#b3b3b3",
      account: t.account.name,
    })),
  });
}
