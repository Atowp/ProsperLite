import { Card } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function DashboardSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Expenses Skeleton */}
      <Card className="md:col-span-2 p-8">
        <Skeleton className="h-5 w-48 mb-1" />
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </Card>

      {/* Recent Transactions Skeleton */}
      <Card className="md:row-span-2 flex flex-col p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Pie Chart Skeleton */}
      <Card className="p-6 min-h-[350px]">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex justify-center">
          <Skeleton className="h-[240px] w-[240px] rounded-full" />
        </div>
      </Card>

      {/* Monthly Budget Progress Skeleton */}
      <Card className="p-6 min-h-[350px]">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex justify-center">
          <Skeleton className="h-[240px] w-[240px] rounded-full" />
        </div>
      </Card>

      {/* Expense Trends Bar Chart Skeleton */}
      <Card className="md:col-span-3 p-6 min-h-[400px]">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-[300px] w-full" />
      </Card>
    </section>
  );
}
