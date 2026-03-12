import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Skeleton (Min-h screen) */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-muted/30">
        <div className="container px-4 flex flex-col items-center text-center gap-6">
          <Skeleton className="h-8 w-64 rounded-full" />
          <Skeleton className="h-16 md:h-24 w-full max-w-2xl" />
          <Skeleton className="h-20 w-full max-w-xl" />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Skeleton className="h-14 w-48 rounded-full" />
            <Skeleton className="h-14 w-48 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Skeleton */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Skeleton className="aspect-square md:aspect-4/5 rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Generic Grid Skeleton (Products/Associates) */}
      <section className="container mx-auto px-4 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
