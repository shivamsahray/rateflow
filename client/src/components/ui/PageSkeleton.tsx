import type { ReactNode } from "react";

interface PageSkeletonProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  rows?: number;
}

function PageSkeleton({ title = "Loading", subtitle = "Fetching data", actions, rows = 4 }: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="mx-auto flex w-full items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
          {actions ?? <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />}
        </div>
      </div>

      <div className="mx-auto w-full space-y-8 px-8 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
