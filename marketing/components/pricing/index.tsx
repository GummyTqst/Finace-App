import Link from "next/link";
import Stripe from "stripe";

import { Section, SectionHeading } from "@/components/section";

type Plan = {
  id: string;
  name: string;
  description: string;
  unitAmount: number;
  currency: string;
  interval: string | undefined;
};

function parseFeatures(description: string): string[] {
  return description
    .split(/\n|✓/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-•✓]\s*/, ""));
}

const isNote = (feature: string) => /^everything in/i.test(feature);

function formatPrice(unitAmount: number, currency: string): string {
  return Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(unitAmount / 100);
}

function intervalLabel(interval: string | undefined): string {
  switch (interval) {
    case "year":
      return "/ år";
    case "week":
      return "/ uge";
    default:
      return "/ måned";
  }
}

export default async function Pricing() {
  const { STRIPE_SECRET } = process.env;

  const stripeClient = new Stripe(STRIPE_SECRET || "");

  const products = await stripeClient.products.list({
    expand: ["data.default_price"],
    active: true,
  });

  const plans: Plan[] = products.data
    .map((product) => {
      const price = product.default_price as Stripe.Price | null;
      const unitAmount =
        price && "unit_amount" in price ? price.unit_amount : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        unitAmount: unitAmount ?? 0,
        currency: price?.currency ?? "EUR",
        interval:
          price && "recurring" in price ? price.recurring?.interval : undefined,
      };
    })
    .filter((plan) => plan.unitAmount >= 0)
    .sort((a, b) => a.unitAmount - b.unitAmount);

  const featuredIndex = plans.length > 1 ? Math.floor(plans.length / 2) : -1;

  return (
    <Section id="pricing" className="bg-neutral-50 dark:bg-neutral-950/50">
      <SectionHeading
        eyebrow="Priser"
        title="Vælg et abonnement"
        subtitle="Enkel og gennemsigtig prissætning. Skift eller opsig dit abonnement når som helst."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan, index) => {
          const featured = index === featuredIndex;
          const features = parseFeatures(plan.description);
          const notes = features.filter(isNote);
          const items = features.filter((feature) => !isNote(feature));

          return (
            <article
              key={plan.id}
              className={[
                "relative flex flex-col rounded-2xl border p-8 transition-shadow",
                featured
                  ? "border-emerald-600 shadow-xl shadow-emerald-600/10"
                  : "border-neutral-200 dark:border-neutral-800",
              ].join(" ")}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Mest populær
                </span>
              )}

              <h2 className="text-lg font-semibold">{plan.name}</h2>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {formatPrice(plan.unitAmount, plan.currency)}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {intervalLabel(plan.interval)}
                </span>
              </div>

              {notes.map((note, i) => (
                <p
                  key={`note-${i}`}
                  className="mt-4 text-sm italic text-neutral-500 dark:text-neutral-400"
                >
                  {note}
                </p>
              ))}

              {items.length > 0 && (
                <ul className="mt-6 space-y-3 text-sm mb-6">
                  {items.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/register?subscription=${plan.id}`}
                className={[
                  "mt-auto block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                  featured
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
                ].join(" ")}
              >
                Køb
              </Link>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
