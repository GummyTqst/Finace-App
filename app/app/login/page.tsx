import LoginForm from "@/components/forms/login-form";

export default async function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] p-4 text-black">
      <div className="w-full max-w-2xl bg-white rounded-xl p-8 shadow-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
