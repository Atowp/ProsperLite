import { lazy, Suspense, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@ui/sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "@ui/button";
import PlusIcon from "~icons/lucide/plus";
import { useStore } from "@/store/useStore";
import { SuspenseWrapper } from "@/components/SuspenseWrapper";

// Lazy load non-critical components
const AppSidebar = lazy(() =>
  import("@/components/app-sidebar").then((m) => ({
    default: m.AppSidebar,
  }))
);
const TransactionActionDialog = lazy(() =>
  import("@/features/transactions").then((m) => ({
    default: m.TransactionActionDialog,
  }))
);

function Layout() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { addTransaction } = useStore();

  const handleQuickAdd = () => setIsQuickAddOpen(true);
  const handleQuickAddSuccess = () => setIsQuickAddOpen(false);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b px-4 bg-background/95 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <span className="font-bold text-lg tracking-tight">ProsperLite</span>

          <div className="flex-1" />

          <Button size="sm" className="gap-2" onClick={handleQuickAdd}>
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Start</span>
          </Button>
        </header>
        <div className="min-h-screen bg-background p-6">
          <main className="max-w-5xl mx-auto">
            <SuspenseWrapper>
              <Outlet />
            </SuspenseWrapper>
          </main>
        </div>
      </SidebarInset>

      {/* Lazy loaded Dialog */}
      <Suspense fallback={null}>
        <TransactionActionDialog
          isOpen={isQuickAddOpen}
          onOpenChange={setIsQuickAddOpen}
          onSubmit={addTransaction}
          onClose={handleQuickAddSuccess}
        />
      </Suspense>
    </SidebarProvider>
  );
}

export default Layout;
