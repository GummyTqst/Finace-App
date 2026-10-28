import Link from "next/link";

const links = [
  { href: "#features", label: "Funktioner" },
  { href: "#pricing", label: "Priser" },
  { href: "#security", label: "Sikkerhed" },
  { href: "#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <svg
              className="h-6 w-6 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            Personal Finance
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">
          Personal Finance er beregnet til personlig økonomisk organisering,
          budgettering og undervisningsformål. Prognoser og indsigter er skøn
          genereret ud fra dine egne data og skal ikke behandles som
          professionel finansiel, investerings-, skatte- eller juridisk
          rådgivning.
        </p>

        <p className="mt-4 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} Personal Finance. Alle rettigheder
          forbeholdes.
        </p>
      </div>
    </footer>
  );
}
