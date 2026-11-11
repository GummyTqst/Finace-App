import { requireUser } from "@/config/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/config/prisma";
import z from "zod";
import { getExchangeRate } from "@/lib/currency";

const updateSchema = z.object({
  currency: z.enum(["EUR", "USD", "GBP", "DKK", "SEK", "NOK"]),
});

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      currency: user.currency ?? "EUR",
      active: user.active,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });

  const nextCurrency = parsed.data.currency;
  const previousCurrency = (user.currency ?? "EUR").toUpperCase();

  if (previousCurrency !== nextCurrency) {
    let rate: number;
    try {
      rate = await getExchangeRate(previousCurrency, nextCurrency);
    } catch {
      return NextResponse.json(
        { error: "Could not get an exchange rate right now. Please try again." },
        { status: 503 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const accounts = await tx.account.findMany({
        where: { userId: user.id, currency: previousCurrency },
        select: { id: true, balance: true },
      });
      const accountIds = accounts.map((account) => account.id);

      for (const account of accounts) {
        await tx.account.update({
          where: { id: account.id },
          data: {
            balance: Number(account.balance) * rate,
            currency: nextCurrency,
          },
        });
      }

      if (accountIds.length > 0) {
        const transactions = await tx.transaction.findMany({
          where: { userId: user.id, accountId: { in: accountIds } },
          select: { id: true, amount: true },
        });
        for (const transaction of transactions) {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: { amount: Number(transaction.amount) * rate },
          });
        }
      }

      const budgets = await tx.budget.findMany({
        where: { userId: user.id },
        select: { id: true, amount: true },
      });
      for (const budget of budgets) {
        await tx.budget.update({
          where: { id: budget.id },
          data: { amount: Number(budget.amount) * rate },
        });
      }

      const goals = await tx.goal.findMany({
        where: { userId: user.id },
        select: { id: true, targetAmount: true },
      });
      for (const goal of goals) {
        await tx.goal.update({
          where: { id: goal.id },
          data: { targetAmount: Number(goal.targetAmount) * rate },
        });
        await tx.goalContribution.updateMany({
          where: { goalId: goal.id },
          data: { amount: { multiply: rate } },
        });
      }

      await tx.recurringBill.updateMany({
        where: { userId: user.id },
        data: { amount: { multiply: rate } },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { currency: nextCurrency },
      });
    });
  }

  return NextResponse.json({ ok: true });
}
