import { Section, SectionHeading } from "@/components/section";

type SecurityItem = {
  title: string;
  description: string;
};

const items: SecurityItem[] = [
  {
    title: "Sikker godkendelse",
    description: "Konti beskyttes med stærk, sikker godkendelse.",
  },
  {
    title: "Adgangskode-hashing",
    description: "Adgangskoder gemmes aldrig i klartekst.",
  },
  {
    title: "To-faktor-godkendelse",
    description: "Ekstra sikkerhedslag for din konto.",
  },
  {
    title: "Sessionsstyring",
    description: "Kontrollér og afslut aktive sessioner.",
  },
  {
    title: "Loginhistorik",
    description: "Følg med i, hvem der logger på din konto.",
  },
  {
    title: "Data-kryptering",
    description: "Din finansielle data beskyttes med kryptering.",
  },
  {
    title: "Data-eksport",
    description: "Tag dine data med dig når som helst.",
  },
  {
    title: "Kontosletning",
    description: "Slet din konto og dine data permanent.",
  },
  {
    title: "Minimal administratoradgang",
    description: "Vi indsamler kun den data, vi reelt har brug for.",
  },
];

export default function Security() {
  return (
    <Section id="security">
      <SectionHeading
        eyebrow="Sikkerhed"
        title="Dine finansielle data er beskyttet"
        subtitle="Vi følger princippet om at indsamle og eksponere så lidt følsom finansiel information som muligt."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
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
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
