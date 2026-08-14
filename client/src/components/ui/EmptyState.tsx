import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  variant?: "empty" | "error";
}

function EmptyState({ title, description, actionLabel, onAction, icon, variant = "empty" }: EmptyStateProps) {
  const isError = variant === "error";

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm ${isError ? "border-red-200 bg-red-50/70" : ""}`}>
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isError ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-400"}`}>
        {icon ?? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4" />
          </svg>
        )}
      </div>
      <h3 className={`text-lg font-semibold ${isError ? "text-red-700" : "text-slate-800"}`}>{title}</h3>
      <p className={`mx-auto mt-2 max-w-md text-sm ${isError ? "text-red-600" : "text-slate-500"}`}>{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`mt-6 rounded-lg px-4 py-2 text-sm font-medium transition ${isError ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-900 text-white hover:bg-slate-700"}`}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
