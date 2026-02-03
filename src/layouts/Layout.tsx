import { SidebarInset, SidebarProvider } from "@ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@ui/sidebar";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { TransactionActionDialog } from "@/features/transactions";
import { useStore } from "@/store/useStore";

function Layout() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { addTransaction } = useStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b px-4 bg-background/95 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <span className="font-bold text-lg tracking-tight">ProsperLite</span>

          <div className="flex-1" />

          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsQuickAddOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Start</span>
          </Button>
        </header>
        <div className="min-h-screen bg-background p-6">
          <main className="max-w-5xl mx-auto">
            <Outlet />
          </main>
        </div>
      </SidebarInset>

      {/* Quick Add Dialog */}
      <TransactionActionDialog
        isOpen={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
        onSubmit={addTransaction}
      />
    </SidebarProvider>
  );
}

export default Layout;
