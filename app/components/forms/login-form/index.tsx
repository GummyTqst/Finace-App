// /app : /components/forms/login-form/index.tsx
"use client";

import { useActionState } from "react";
import loginAction, { LoginFormState } from "./login-action";

export default function LoginForm() {
  const [formState, formAction, pending] = useActionState<
    LoginFormState,
    FormData
  >(loginAction, {});
  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      <div>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-600">E-mail</span>
          <input type="email" name="email" className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </label>
      </div>
      <div>
        <label className="flex flex-col gap-100">
          <span className="text-sm font-semibold text-gray-600">Adgangskode</span>
          <input type="password" name="password" className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </label>
      </div>
      <button type="submit" disabled={pending} className="bg-gray-900 text-white px-5 py-3 rounded-lg mt-4">
        {pending ? "Logger ind..." : "Log ind"}
      </button>
      {formState?.error?.message && (
        <p role="alert">{formState.error.message}</p>
      )}
    </form>
  );
}
