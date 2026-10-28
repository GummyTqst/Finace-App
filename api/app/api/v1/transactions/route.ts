// api/app/api/v1/transactions/route.ts
import prisma from "@/config/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/config/auth";
import type { Prisma } from "@/generated/prisma/client";
import z from "zod";

const transactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]),
  description: z.string().min(1).max(120),
  amount: z.coerce.number().positive(),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
});

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId");
  const categoryId = url.searchParams.get("categoryId");
  const search = url.searchParams.get("search");
  const page = Math.max(Number(url.searchParams.get("page") ?? 1), 1);
  const take = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? 20), 1),
    100,
  );
  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");
  const sort = url.searchParams.get("sort") ?? "latest";

  const where: Prisma.TransactionWhereInput = { userId: user.id };
  if (accountId) where.accountId = accountId;
  if (categoryId) where.categoryId = categoryId;
  if (search) where.description = { contains: search, mode: "insensitive" };
  if (month && year) {
    where.date = {
      gte: new Date(Number(year), Number(month) - 1, 1),
      lt: new Date(Number(year), Number(month), 1),
    };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, account: true },
      orderBy:
        sort === "oldest"
          ? { date: "asc" }
          : sort === "az"
            ? { description: "asc" }
            : sort === "za"
              ? { description: "desc" }
              : sort === "highest"
                ? { amount: "desc" }
                : sort === "lowest"
                  ? { amount: "asc" }
                  : { date: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    total,
    page,
    transactions: transactions.map((t) => ({
      id: t.id,
      description: t.description,
      amount: Number(t.amount),
      type: t.type,
      date: t.date,
      notes: t.notes,
      category: t.category?.name ?? "Uden kategori",
      categoryColor: t.category?.color ?? "#b3b3b3",
      account: t.account.name,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = transactionSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid transaction" }, { status: 400 });
  const account = await prisma.account.findFirst({
    where: { id: parsed.data.accountId, userId: user.id },
  });
  if (!account)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (parsed.data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: parsed.data.categoryId, userId: user.id },
    });
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
  }
  const signedAmount =
    parsed.data.type === "expense" ? -parsed.data.amount : parsed.data.amount;
  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.transaction.create({
      data: {
        ...parsed.data,
        categoryId: parsed.data.categoryId || null,
        userId: user.id,
      },
    });
    await tx.account.update({
      where: { id: account.id },
      data: { balance: { increment: signedAmount } },
    });
    return created;
  });
  return NextResponse.json({ id: transaction.id }, { status: 201 });
}
