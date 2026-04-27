import { useEffect } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  maxWidthClassName = "max-w-2xl",
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className={[
          "relative w-full",
          maxWidthClassName,
          "rounded-2xl bg-white brand-ring",
          "animate-fadeIn",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-lg font-semibold text-slate-900">
                {title}
              </h2>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

