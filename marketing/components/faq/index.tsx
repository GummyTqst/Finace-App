import { Section, SectionHeading } from "@/components/section";

const faqs = [
  {
    question: "Hvad er Personal Finance?",
    answer:
      "Personal Finance samler al din økonomi ét sted: du kan spore indtægter og udgifter, oprette budgetter og opsparingsmål, holde styr på abonnementer og faste udgifter, og få rapporter, prognoser og indsigter om dit forbrug.",
  },
  {
    question: "Er mine finansielle data sikre?",
    answer:
      "Ja. Vi bruger sikker godkendelse, adgangskoder hashes aldrig i klartekst, data krypteres, og vi følger princippet om at indsamle og eksponere så lidt følsom finansiel information som muligt. Du kan til enhver tid eksportere eller slette dine data.",
  },
  {
    question: "Kan jeg skifte eller opsige mit abonnement når som helst?",
    answer:
      "Ja. Du kan opgradere, nedgradere eller opsige dit abonnement når som helst, direkte fra dine indstillinger. Abonnementet er månedligt og uden binding.",
  },
  {
    question: "Hvordan fungerer CSV-import?",
    answer:
      "Du eksporterer transaktionerne fra din bank som en CSV-fil og uploader dem. Vi registrerer automatisk kolonnerne, kategoriserer transaktionerne, og giver dig mulighed for at gennemgå dem, før de importeres.",
  },
  {
    question: "Er prognoserne 100% præcise?",
    answer:
      "Nej. Prognoser og indsigter er skøn baseret på dine egne data og skal ikke betragtes som professionel finansiel, investerings-, skatte- eller juridisk rådgivning. Vigtige økonomiske beslutninger bør du altid verificere med kvalificeret hjælp.",
  },
  {
    question: "Understøtter I automatisk bank-synkronisering?",
    answer:
      "Ikke endnu. Automatisk bankintegration og transaktions-synkronisering er på vores roadmap. Indtil da kan du nemt importere dine transaktioner med CSV.",
  },
];

export default function Faq() {
  return (
    <Section id="faq" className="bg-neutral-50 dark:bg-neutral-950/50">
      <SectionHeading
        eyebrow="FAQ"
        title="Ofte stillede spørgsmål"
        subtitle="Kan du ikke finde svaret her? Kontakt os, og vi hjælper dig."
      />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-medium">
              {faq.question}
              <svg
                className="h-5 w-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
