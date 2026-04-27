export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export const ui = {
  page: "min-h-screen bg-[var(--brand-bg)]",
  card: "rounded-2xl bg-white brand-ring",
  cardHeader: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  h1: "text-2xl font-bold text-slate-900",
  h2: "text-lg font-semibold text-slate-900",

  input:
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 brand-focus",

  select:
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 brand-focus",

  textarea:
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 brand-focus",

  btnBase:
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60",

  btnPrimary:
    "bg-[var(--brand-navy)] text-white hover:bg-slate-800",

  btnAccent:
    "bg-[var(--brand-accent)] text-slate-900 hover:brightness-95",

  btnSoft:
    "bg-slate-100 text-slate-900 hover:bg-slate-200",

  btnDanger:
    "bg-red-600 text-white hover:bg-red-700",

  /** Landing / marketing sections */
  landingContainer: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
  landingSectionTitle:
    "text-2xl font-bold tracking-tight text-(--brand-blue) sm:text-3xl",
  landingSectionAccent: "mt-3 h-1 w-14 shrink-0 rounded-full bg-(--brand-accent)",

  /** Dashboard shell (admin / faculty / student) */
  dashShell:
    "flex h-[100dvh] w-full overflow-hidden bg-slate-200/80",
  dashMainColumn: "flex min-h-0 min-w-0 flex-1 flex-col",
  dashContent:
    "min-h-0 flex-1 overflow-y-auto bg-(--brand-bg) p-3 sm:p-5 lg:p-6",

  dashSidebarFrame:
    "flex h-full w-[min(18rem,85vw)] shrink-0 flex-col border-r border-slate-900/20 bg-linear-to-b from-(--brand-blue-2) to-(--brand-blue) text-white shadow-[4px_0_24px_-8px_rgba(15,23,42,0.35)]",

  dashSidebarBrand:
    "border-b border-white/10 px-4 py-5 sm:px-5",

  dashSidebarBrandTitle: "text-lg font-bold tracking-tight text-white",
  dashSidebarBrandSub: "mt-0.5 text-xs font-medium text-amber-200/90",

  dashSidebarNav: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3 sm:px-3",

  dashSidebarFooter: "border-t border-white/10 p-2 sm:p-3",

  dashHeader:
    "sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white/95 px-3 py-3 shadow-sm backdrop-blur-md sm:gap-4 sm:px-5 sm:py-3.5",

  dashHeaderTitle: "text-base font-bold tracking-tight text-slate-900 sm:text-lg",
  dashHeaderMeta: "mt-0.5 text-xs text-slate-500",

  dashTableCard:
    "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm",
  dashTableScroller: "overflow-x-auto",
  dashTable: "w-full min-w-0 text-left text-sm text-slate-700",
  dashTableHead: "bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500",
  dashTableTh: "whitespace-nowrap px-4 py-3.5 first:pl-5 last:pr-5",
  dashTableRow: "border-t border-slate-100 transition-colors hover:bg-amber-50/50",
  dashTableTd: "px-4 py-3 align-middle first:pl-5 last:pr-5",
};

/** Active / inactive nav link inside navy dashboard sidebar */
export function dashNavLinkClass(isActive) {
  return cx(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-white/14 text-white shadow-inner ring-1 ring-amber-400/35"
      : "text-slate-200/95 hover:bg-white/10 hover:text-white"
  );
}

