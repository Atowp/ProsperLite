import Loader2Icon from "~icons/lucide/loader-2";

/**
 * PageLoader Component
 *
 * Loading fallback component used with Suspense for lazy-loaded routes.
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  );
}
