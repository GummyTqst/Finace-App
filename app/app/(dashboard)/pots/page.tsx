import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AddPotModal, PotActions, PotMenu } from "@/components/pots/pot-modals";
import { redirect } from "next/navigation";

type Pot = {
  id: string;
  name: string;
  targetAmount: number;
  saved: number;
  color: string;
};
export default async function PotsPage() {
  let data: { pots: Pot[] };
  try {
    data = await apiFetch("/pots");
  } catch {
    redirect("/login");
  }
  return (
    <div className="space-y-400">
      <div className="flex flex-wrap items-start justify-between gap-300">
        <div>
          <h1 className="text-2xl font-bold text-grey-900">Pots</h1>
          <p className="text-sm text-grey-500">
            Set money aside for the things that matter.
          </p>
        </div>
        <AddPotModal usedColors={data.pots.map((pot) => pot.color)} />
      </div>
      <div className="grid grid-cols-1 gap-400 md:grid-cols-2">
        {data.pots.map((p) => (
          <article key={p.id} className="flex flex-col rounded-2xl bg-white p-600">
            <div className="flex items-start justify-between gap-300">
              <div className="flex items-center gap-250">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <h2 className="font-bold text-grey-900">{p.name}</h2>
              </div>
              <PotMenu pot={p} usedColors={data.pots.map((pot) => pot.color)} />
            </div>
            <div className="mt-600">
              <div className="flex items-end justify-between gap-300">
                <span className="text-sm text-grey-500">Total Saved</span>
                <strong className="text-3xl text-grey-900">
                  {formatCurrency(p.saved)}
                </strong>
              </div>
              <div className="my-300 h-2 rounded-full bg-beige-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.targetAmount ? Math.min((p.saved / p.targetAmount) * 100, 100) : 0}%`,
                    backgroundColor: p.color,
                  }}
                />
              </div>
              <div className="flex justify-between gap-300 text-sm">
                <span className="font-bold text-grey-500">
                  {p.targetAmount
                    ? Math.round((p.saved / p.targetAmount) * 100)
                    : 0}
                  %
                </span>
                <span className="text-grey-500">
                  Target of {formatCurrency(p.targetAmount)}
                </span>
              </div>
            </div>
            <PotActions pot={p} />
          </article>
        ))}
      </div>
    </div>
  );
}
