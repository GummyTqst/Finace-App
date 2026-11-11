import Link from "next/link";

const features = ["Track your expenses", "Secure and private data", "Customizable budgets"];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] text-grey-900" style={{ backgroundImage: "linear-gradient(rgba(39,124,120,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(39,124,120,0.08) 1px, transparent 1px)", backgroundSize: "43px 43px" }}>
      <header className="flex items-center justify-between px-500 py-500 sm:px-1000">
        <Link href="/welcome" className="text-3xl font-bold tracking-tight">Finace</Link>
        <Link href="/login" className="rounded-xl bg-grey-900 px-500 py-300 text-sm font-bold text-white hover:bg-green">Sign In</Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center px-500 pb-1000 text-center">
        <div className="rounded-full border border-green/30 bg-white/80 px-400 py-200 text-sm font-medium text-grey-500 shadow-sm">Smart financial management made simple</div>
        <h1 className="mt-700 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Take control of your <span className="text-green">financial life</span>
        </h1>
        <p className="mt-500 max-w-2xl text-lg leading-8 text-grey-500">
          Track expenses, manage budgets, and achieve your financial goals with one clear personal finance platform.
        </p>
        <Link href="/proceed" className="mt-700 rounded-xl bg-green px-700 py-400 text-base font-bold text-white shadow-xl shadow-green/20 hover:bg-grey-900">Get Started</Link>
        <div className="mt-1000 flex flex-wrap justify-center gap-300">
          {features.map((feature) => <span key={feature} className="rounded-full bg-white px-400 py-250 text-sm text-grey-500 shadow-md">✦ {feature}</span>)}
        </div>
      </section>
    </main>
  );
}
