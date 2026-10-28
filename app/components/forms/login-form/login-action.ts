"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginFormState = {
  success?: boolean;
  data?: {
    email?: string;
    password?: string;
  };
  error?: {
    email?: { errors: string[] };
    password?: { errors: string[] };
    message?: string;
  };
};

const API_URL = (process.env.API_URL ?? "http://localhost:3001/api/v1").replace(
  /\/api\/v1\/?$/,
  "",
);

export default async function loginAction(
  prevState: LoginFormState,
  formData: FormData,
) {
  const { email, password } = Object.fromEntries(formData);

  const validated = schema.safeParse({ email, password });

  if (!validated.success) {
    return {
      ...validated,
      error: z.treeifyError(validated.error).properties,
    };
  }

  const response = await fetch(`${API_URL}/auth/tokens`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: validated.data.email,
      password: validated.data.password,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    let message = "Kunne ikke logge ind. Prøv igen.";
    try {
      const parsed = JSON.parse(body);
      if (typeof parsed?.message === "string") message = parsed.message;
    } catch {
      // body was not JSON — keep the fallback message
    }
    return { success: false, error: { message } };
  }

  const json = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", json.token, { expires: new Date(json.expiresIn) });
  cookieStore.set("refreshToken", json.refreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  redirect("/");
}
