"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type SignupState = { error?: string };

export default async function signupAction(_previous: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details" };

  const apiBase = (process.env.API_URL ?? "http://localhost:3001/api/v1").replace(/\/api\/v1\/?$/, "");
  const response = await fetch(`${apiBase}/api/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: parsed.data.name, email: parsed.data.email, password: parsed.data.password }),
  });
  if (!response.ok) return { error: "Could not create the account. This email may already be in use." };

  const loginResponse = await fetch(`${apiBase}/api/v1/auth/tokens`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
  });
  if (!loginResponse.ok) return { error: "Account created. Please sign in to continue." };

  const tokens = await loginResponse.json();
  const cookieStore = await cookies();
  cookieStore.set("token", tokens.token, { expires: new Date(tokens.expiresIn) });
  cookieStore.set("refreshToken", tokens.refreshToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
  redirect("/onboarding");
}
