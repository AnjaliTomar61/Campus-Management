import { X } from "lucide-react";
import { cx, ui } from "../../lib/ui";

/**
 * Shared sidebar chrome: brand block, scrollable nav, footer slot.
 * Mobile: fixed panel + backdrop when `open`; desktop: static in flow.
 */
export function DashboardSidebarShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  /** Merged with default nav classes, e.g. `overflow-hidden` to hide scrollbar when nav is short */
  navClassName,
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cx(
          ui.dashSidebarFrame,
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className={cx(ui.dashSidebarBrand, "flex items-start justify-between gap-2 pr-2")}>
          <div>
            <p className={ui.dashSidebarBrandTitle}>{title}</p>
            {subtitle ? <p className={ui.dashSidebarBrandSub}>{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-white/90 hover:bg-white/10 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className={cx(ui.dashSidebarNav, navClassName)}>{children}</nav>

        <div className={ui.dashSidebarFooter}>{footer}</div>
      </aside>
    </>
  );
}
