import { Skeleton } from '@/components/ui/skeleton';

export function TrackTableSkeleton() {
  return (
    <div data-testid="loading-indicator" className="container mx-auto py-10 space-y-4">
      <Skeleton className="h-10 w-1/3" />

      <div className="grid grid-cols-7 gap-2 items-center font-semibold px-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Skeleton rows */}
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-7 gap-4 items-center px-4 py-3 border rounded-md">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-16 rounded" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}
