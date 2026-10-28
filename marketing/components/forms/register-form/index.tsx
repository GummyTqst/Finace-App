"use client";

import { useActionState, useEffect } from "react";
import registerAction from "./register-action";

const inputClasses =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-100 dark:focus:ring-neutral-100/10";

export default function RegisterForm({
  subscription,
}: {
  subscription?: string;
}) {
  const [formState, formAction, pending] = useActionState(registerAction, {});

  useEffect(
    function () {
      if (formState?.success) {
        window.location.href = formState.checkoutUrl;
      }
    },
    [formState],
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-2xl font-semibold tracking-tight">
            Opret bruger
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Udfyld formularen for at oprette din konto.
          </p>

          <form action={formAction} className="mt-8 space-y-5">
            <input type="hidden" name="subscription" value={subscription} />
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="name"
              >
                Navn
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Dit fulde navn"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="dig@eksempel.dk"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="password"
              >
                Adgangskode
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Mindst 8 tegn"
                className={inputClasses}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                name="tos_read"
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Jeg har læst og accepterer brugerbetingelserne</span>
            </label>

            {formState?.error && (
              <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {formState.error}
              </p>
            )}

            {formState?.success && (
              <p className="rounded-lg bg-green-50 px-3.5 py-2.5 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                Bruger oprettet!
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              {pending ? "Opretter..." : "Gennemfør køb"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
