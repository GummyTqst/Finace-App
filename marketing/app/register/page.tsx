import RegisterForm from "@/components/forms/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  const { subscription } = await searchParams;

  return (
    <>
      <h1>Registrer</h1>
      <RegisterForm subscription={subscription} />
    </>
  );
}
