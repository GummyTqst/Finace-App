import { NextRequest, NextResponse } from "next/server";

import prisma from "@/config/prisma";
import { nextDueDate } from "@/lib/recurring-bills";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  return Boolean(secret && authorization === `Bearer ${secret}`);
}

async function processBills(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dueBills = await prisma.recurringBill.findMany({
    where: {
      active: true,
      autoCreate: true,
      accountId: { not: null },
      nextDueDate: { lte: now },
    },
  });

  let processed = 0;
  let skipped = 0;

  for (const bill of dueBills) {
    if (!bill.accountId || !bill.nextDueDate) {
      skipped += 1;
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const current = await tx.recurringBill.findUnique({ where: { id: bill.id } });
        if (!current || !current.active || !current.autoCreate || !current.accountId || !current.nextDueDate || current.nextDueDate > now) {
          return;
        }

        await tx.transaction.create({
          data: {
            userId: current.userId,
            accountId: current.accountId,
            categoryId: current.categoryId,
            type: "expense",
            description: current.name,
            amount: current.amount,
            date: now,
            recurringId: current.id,
          },
        });
        await tx.account.update({
          where: { id: current.accountId },
          data: { balance: { decrement: current.amount } },
        });
        await tx.recurringBill.update({
          where: { id: current.id },
          data: {
            lastPaidDate: now,
            nextDueDate: nextDueDate(current.dueDay, new Date(now.getFullYear(), now.getMonth() + 1, 1)),
          },
        });
      });
      processed += 1;
    } catch {
      skipped += 1;
    }
  }

  return NextResponse.json({ processed, skipped });
}

export async function GET(request: NextRequest) {
  return processBills(request);
}

export async function POST(request: NextRequest) {
  return processBills(request);
}
