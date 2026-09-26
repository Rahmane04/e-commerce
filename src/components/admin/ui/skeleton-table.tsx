import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, cols = 5, className }: SkeletonTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200", className)}>
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 animate-pulse rounded bg-slate-200",
                i === 0 ? "w-32" : i === cols - 1 ? "w-20 ml-auto" : "w-24",
              )}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="border-b border-slate-100 bg-white px-4 py-3 last:border-b-0"
        >
          <div className="flex items-center gap-4">
            {/* Image thumbnail placeholder */}
            <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded bg-slate-200" />
            {Array.from({ length: cols - 1 }).map((_, colIndex) => (
              <div
                key={colIndex}
                style={{ animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` }}
                className={cn(
                  "h-4 animate-pulse rounded bg-slate-200",
                  colIndex === 0
                    ? "flex-1"
                    : colIndex === cols - 2
                      ? "w-20 ml-auto"
                      : "w-24",
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
