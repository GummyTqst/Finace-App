"use client";

import { useActionState } from "react";
import signupAction, { type SignupState } from "./signup-action";

export default function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(signupAction, {});
  return (
    <form action={action} className="space-y-300">
      <label className="block"><span className="mb-100 block text-sm font-bold text-grey-500">Name</span><input name="name" required className="field pl-300" /></label>
      <label className="block"><span className="mb-100 block text-sm font-bold text-grey-500">Email</span><input name="email" type="email" required className="field pl-300" /></label>
      <label className="block"><span className="mb-100 block text-sm font-bold text-grey-500">Password</span><input name="password" type="password" minLength={8} required className="field pl-300" /></label>
      <label className="block"><span className="mb-100 block text-sm font-bold text-grey-500">Confirm password</span><input name="confirmPassword" type="password" minLength={8} required className="field pl-300" /></label>
      {state.error && <p role="alert" className="rounded-lg bg-red/10 p-300 text-sm text-red">{state.error}</p>}
      <button type="submit" disabled={pending} className="button w-full">{pending ? "Creating account..." : "Create account"}</button>
    </form>
  );
}
