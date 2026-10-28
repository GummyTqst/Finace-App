export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="w-full max-w-6xl mx-auto px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-14">
      <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight mt-3">{title}</h2>
      {subtitle && (
        <p className="text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
