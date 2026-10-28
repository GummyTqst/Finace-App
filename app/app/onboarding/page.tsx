import OnboardingForm from "@/components/onboarding/onboarding-form";
import { apiFetch } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    try {
        const accounts = await apiFetch<{
            accounts: { id: string }[];
        }>("/accounts")

        if (accounts.accounts.length > 0) {
            redirect("/");
        }
    } catch {
        redirect("/login");
    }

    return <OnboardingForm />;
}