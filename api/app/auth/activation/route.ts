import prisma from "@/config/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activationstring = searchParams.get("activationstring");
  const [userId, activationKey] = atob(activationstring!).split(":");

  const user = await prisma.user.update({
    where: {
      id: userId,
      activation_key: activationKey,
    },
    data: {
      active: true,
      activation_key: "",
    },
  });

  redirect("http://localhost:3100/login?activation_success");
}
