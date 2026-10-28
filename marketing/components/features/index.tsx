import { Section, SectionHeading } from "@/components/section";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Dashboard",
    description:
      "Få et samlet overblik over balance, indkomst, udgifter, opsparing og budgetter på én skærm.",
    icon: (
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    ),
  },
  {
    title: "Transaktioner",
    description:
      "Registrer indtægter, udgifter og overførsler, og organisér dem i kategorier på tværs af dine konti.",
    icon: (
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    title: "Budgetter",
    description:
      "Sæt månedlige budgetter pr. kategori og få advarsler, hvis du bruger hurtigere, end budgettet tillader.",
    icon: (
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
  {
    title: "Opsparingsmål",
    description:
      "Sæt finansielle mål, følg fremskridtet, og få et skøn på, hvor meget du skal spare hver måned.",
    icon: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  },
  {
    title: "Abonnementer",
    description:
      "Hold styr på streaming, software og andre faste udgifter — og få udpeget abonnementer, du sjældent bruger.",
    icon: (
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
  },
  {
    title: "Rapporter",
    description:
      "Analysér dine vaner med indkomst-, udgifts- og kategorirapporter, og sammenlign perioder mod hinanden.",
    icon: (
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
  {
    title: "Prognoser",
    description:
      "Få et skøn over din fremtidige saldo baseret på faste indtægter, udgifter og historisk forbrug.",
    icon: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  },
  {
    title: "CSV-import",
    description:
      "Importer transaktioner fra din bank med CSV og få dem automatisk kategoriseret til gennemgang.",
    icon: (
      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    ),
  },
  {
    title: "Nettoformue",
    description:
      "Følg din samlede formue over tid med aktiver og passiver fra alle dine konti.",
    icon: (
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
];

export default function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Funktioner"
        title="Alt du skal bruge for at styre din økonomi"
        subtitle="Fra dagligt overblik til fremadrettet planlægning — bygget som én komplet platform."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
