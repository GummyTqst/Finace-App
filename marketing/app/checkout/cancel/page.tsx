import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Betaling annulleret</h1>
        <p className="mt-2 text-neutral-500">
          Du gennemførte ikke betalingen. Din konto er ikke oprettet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Tilbage til produkter
        </Link>
      </div>
    </div>
  );
}
