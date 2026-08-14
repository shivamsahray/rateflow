interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  compact?: boolean;
}

function TableSkeleton({ rows = 6, columns = 5, compact = false }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-3 md:grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-3 w-20 animate-pulse rounded bg-slate-200" />
        ))}
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={`grid gap-4 px-6 py-4 ${compact ? "grid-cols-2" : "grid-cols-1 md:grid-cols-" + columns}`}> 
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div key={columnIndex} className="h-4 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;
