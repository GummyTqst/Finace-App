import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const schema = z.object({
  email: z.email(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  subscriptionStatus: z.string(),
  currentPeriodEnd: z.string().datetime(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const validated = schema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email: validated.data.email },
    data: {
      stripeCustomerId: validated.data.stripeCustomerId,
      stripeSubscriptionId: validated.data.stripeSubscriptionId,
      subscriptionStatus: validated.data.subscriptionStatus,
      currentPeriodEnd: new Date(validated.data.currentPeriodEnd),
    },
  });

  return NextResponse.json({ message: "ok" }, { status: 200 });
}
