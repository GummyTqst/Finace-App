import Link from "next/link";

const demoFeatures = ["Instant access", "No account required", "Pre-configured dashboard"];
const signupFeatures = ["Secure data storage", "Custom dashboard", "Multi-device sync"];

function FeatureList({ items }: { items: string[] }) {
  return <ul className="mt-500 space-y-250 text-sm text-grey-500">{items.map((item) => <li key={item}>✦ <span className="ml-200">{item}</span></li>)}</ul>;
}

export default function ProceedPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] text-grey-900" style={{ backgroundImage: "linear-gradient(rgba(39,124,120,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(39,124,120,0.08) 1px, transparent 1px)", backgroundSize: "43px 43px" }}>
      <header className="flex items-center justify-between px-500 py-500 sm:px-1000">
        <Link href="/welcome" className="text-3xl font-bold tracking-tight">Finace</Link>
        <Link href="/login" className="rounded-xl bg-grey-900 px-500 py-300 text-sm font-bold text-white hover:bg-green">Sign In</Link>
      </header>

      <section className="mx-auto max-w-5xl px-500 pb-1000 pt-700">
        <Link href="/welcome" className="inline-flex rounded-lg bg-green px-400 py-250 font-bold text-white hover:bg-grey-900">← Back</Link>
        <h1 className="mt-700 text-4xl font-bold tracking-tight sm:text-5xl">How would you like to proceed?</h1>
        <p className="mt-200 text-lg text-grey-500">Explore the app with demo data or create an account to track your real finances.</p>

        <div className="mt-700 grid gap-500 lg:grid-cols-2">
          <article className="rounded-2xl border-2 border-grey-300 bg-white/80 p-600 shadow-sm">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-beige-100 text-2xl">♙</div>
            <h2 className="mt-500 text-2xl font-bold">Try Demo Mode</h2>
            <p className="mt-200 text-grey-500">Explore the finance dashboard before creating an account.</p>
            <FeatureList items={demoFeatures} />
            <button type="button" disabled className="mt-700 w-full rounded-xl border border-grey-300 px-400 py-350 font-bold text-grey-500">Demo coming soon</button>
          </article>

          <article className="rounded-2xl border-2 border-green bg-white/80 p-600 shadow-sm">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-green text-2xl text-white">↪</div>
            <div className="mt-500 flex items-center gap-250"><h2 className="text-2xl font-bold">Sign Up</h2><span className="rounded-full bg-green px-250 py-100 text-xs font-bold text-white">Recommended</span></div>
            <p className="mt-200 text-grey-500">Create an account, customize your categories, and start with onboarding.</p>
            <FeatureList items={signupFeatures} />
            <Link href="/signup" className="mt-700 block w-full rounded-xl bg-grey-900 px-400 py-350 text-center font-bold text-white hover:bg-green">Join Now</Link>
          </article>
        </div>

        <p className="mt-700 text-center text-grey-500">Already have an account? <Link href="/login" className="font-bold text-green hover:text-grey-900">Sign in here</Link></p>
      </section>
    </main>
  );
}
