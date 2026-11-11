import { requireUser } from "@/config/auth";
import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  const seenNames = new Set<string>();
  const uniqueCategories = categories.filter((category) => {
    const normalizedName = category.name.trim().toLocaleLowerCase();
    if (seenNames.has(normalizedName)) return false;
    seenNames.add(normalizedName);
    return true;
  });

  return NextResponse.json({
    categories: uniqueCategories.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
    })),
  });
}
