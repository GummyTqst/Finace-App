import Link from "next/link";

import SignupForm from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5f0] p-500">
      <div className="w-full max-w-lg rounded-2xl bg-white p-600 shadow-sm">
        <Link href="/welcome" className="text-2xl font-bold text-grey-900">Finace</Link>
        <h1 className="mt-700 text-3xl font-bold text-grey-900">Create your account</h1>
        <p className="mt-200 text-sm text-grey-500">After signing up, we’ll help you set up your first account.</p>
        <div className="mt-500"><SignupForm /></div>
        <p className="mt-500 text-center text-sm text-grey-500">Already registered? <Link href="/login" className="font-bold text-green">Sign in</Link></p>
      </div>
    </main>
  );
}
