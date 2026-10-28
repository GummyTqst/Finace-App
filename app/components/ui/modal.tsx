"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  maxWidthClassName?: string;
};

/** A shared dialog shell for forms and confirmations throughout the dashboard. */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidthClassName = "max-w-[36rem]",
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-grey-900/70 p-400"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
        className={`max-h-[calc(100vh-2rem)] w-full overflow-y-auto ${maxWidthClassName} rounded-xl bg-white p-500 shadow-2xl sm:p-600`}
      >
        <header className="flex items-start justify-between gap-400">
          <h2 id={titleId} className="text-2xl font-bold text-grey-900">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${title} dialog`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-grey-300 text-xl leading-none text-grey-500 hover:bg-beige-100 hover:text-grey-900"
          >
            ×
          </button>
        </header>
        {description && (
          <div className="mt-200 text-sm leading-6 text-grey-500">
            {description}
          </div>
        )}
        {children}
      </section>
    </div>
  );
}
