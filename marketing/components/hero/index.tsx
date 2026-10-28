import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="w-full max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Din økonomi, samlet ét sted
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Forstå hvor dine penge går, og hvor de er på vej hen.
          </h1>

          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-lg">
            Spor indtægter og udgifter, sæt budgetter og opsparingsmål, og få
            rapporter, prognoser og indsigter — alt sammen ét sted.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Start gratis
            </Link>
            <a
              href="#pricing"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 text-sm font-semibold hover:border-neutral-400 transition-colors"
            >
              Se priser
            </a>
          </div>

          <p className="mt-4 text-xs text-neutral-400">
            Ingen kreditkort. Opsig når som helst.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-900/5 p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Samlet balance
            </p>
            <p className="text-3xl font-bold mt-1">€4.820,50</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4">
                <p className="text-xs text-neutral-500">Indkomst</p>
                <p className="mt-1 font-semibold">€3.200</p>
              </div>
              <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4">
                <p className="text-xs text-neutral-500">Udgifter</p>
                <p className="mt-1 font-semibold">€1.840</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span>Opsparing</span>
                <span className="text-neutral-500">€1.360</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{ width: "42%" }}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <p className="text-xs text-neutral-500 mb-3">
                Sidste transaktioner
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Netflix</span>
                  <span className="text-red-500">−€15,99</span>
                </li>
                <li className="flex justify-between">
                  <span>Løn</span>
                  <span className="text-emerald-600">+€3.200</span>
                </li>
                <li className="flex justify-between">
                  <span>Supermarked</span>
                  <span className="text-red-500">−€82,12</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
