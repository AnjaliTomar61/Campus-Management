import { useEffect, useMemo, useState } from "react";
import { subscribeToNotifications } from "../../lib/notify";

function Toast({ toast, onClose }) {
  const styles =
    toast.type === "success"
      ? "border-green-200 bg-green-50 text-green-900"
      : toast.type === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-slate-200 bg-white text-slate-900";

  return (
    <div
      className={[
        "pointer-events-auto w-full max-w-sm rounded-xl border shadow-lg",
        "px-4 py-3",
        styles,
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-sm opacity-80 hover:opacity-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ToastCenter() {
  const [toasts, setToasts] = useState([]);

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const add = useMemo(() => {
    return (payload) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast = {
        id,
        type: payload?.type || "info",
        message: payload?.message || "",
        timeoutMs: payload?.timeoutMs ?? 3500,
      };

      if (!toast.message) return;

      setToasts((prev) => [toast, ...prev].slice(0, 4));
      window.setTimeout(() => remove(id), toast.timeoutMs);
    };
  }, []);

  useEffect(() => {
    return subscribeToNotifications(add);
  }, [add]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-100 flex w-[min(92vw,420px)] flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}

