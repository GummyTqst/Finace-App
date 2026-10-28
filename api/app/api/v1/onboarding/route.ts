import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const onboardingSchema = z.object({
    account: z.object({
        name: z.string().min(1).max(60),
        type: z.string().min(1),
        currency: z.string().length(3),
        openingBalance: z.coerce.number().min(0),
    }),
    categories: z.array(z.string().min(1).max(60)).min(1),
})

export async function POST(request: NextRequest) {
    const user = await requireUser(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = onboardingSchema.safeParse(await request.json());

    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid onboarding data" }, { status: 400 });
    }

    const existingAccount = await prisma.account.findFirst({
        where: { userId: user.id }
    })

    if (existingAccount) {
        return NextResponse.json({ error: "Onboarding already completed" }, { status: 409 });
    }

    const account = await prisma.$transaction(async (tx) => {
        const createdAccount = await tx.account.create({
            data: {
                userId: user.id,
                name: parsed.data.account.name,
                type: parsed.data.account.type,
                currency: parsed.data.account.currency,
                balance: parsed.data.account.openingBalance,
            },
        })

        for (const categoryName of parsed.data.categories) {
            await tx.category.create({
                data: {
                    userId: user.id,
                    name: categoryName,
                    type: categoryName === "Salary" ? "income" : "expense",
                    isDefault: true,
                }
            })
        }

        return createdAccount;
    })

    return NextResponse.json(
        {
            accountId: account.id,
            onboardingComplete: true,
        },
        { status: 201 }
    )
}