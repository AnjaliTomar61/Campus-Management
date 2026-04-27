import { cx, ui } from "../../lib/ui";

/** Shown for sidebar items that do not have a full module yet. */
export default function DashboardPlaceholder({ title, description }) {
  return (
    <div className={cx("mx-auto max-w-lg space-y-3 p-4 sm:p-6", ui.page)}>
      <div className={cx(ui.card, "p-6")}>
        <h1 className={ui.h1}>{title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {description ||
            "This section is not wired to live data yet. Use the other items in the sidebar, or ask your administrator."}
        </p>
      </div>
    </div>
  );
}
