import { Link } from "react-router-dom";
import { cx, ui } from "../../lib/ui";

/**
 * Shared layout for login / signup: safe vertical padding, scroll on small screens,
 * brand background and card chrome.
 */
export function AuthPageShell({ wide, children }) {
  return (
    <div
      className={cx(
        "min-h-dvh w-full overflow-x-hidden overflow-y-auto",
        "bg-[linear-gradient(165deg,var(--brand-bg)_0%,#e8edf5_42%,var(--brand-bg)_100%)]",
        "flex flex-col items-stretch px-4 py-8 sm:px-6 sm:py-10 lg:py-12"
      )}
    >
      <div
        className={cx(
          "mx-auto flex w-full flex-1 flex-col justify-center",
          wide ? "max-w-lg" : "max-w-md"
        )}
      >
        <Link
          to="/"
          className={cx(
            "mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium",
            "text-(--brand-blue) transition hover:text-slate-900"
          )}
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back to home
        </Link>

        <div
          className={cx(
            ui.card,
            "relative overflow-hidden shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_16px_48px_-16px_rgba(15,23,42,0.14)]"
          )}
        >
          <div
            className="h-1 w-full bg-linear-to-r from-(--brand-blue-2) to-(--brand-blue)"
            aria-hidden
          />
          <div className="animate-fadeIn px-6 pb-8 pt-7 sm:px-9 sm:pb-9 sm:pt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
