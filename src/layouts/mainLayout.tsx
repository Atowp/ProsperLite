import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 bg-background/95 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          {/* <div className="flex items-center gap-3">
            <div className="flex items-center gap-2"> */}
          <span className="font-bold text-lg tracking-tight">ProsperLite</span>
          {/* </div>
          </div> */}

          <div className="flex-1" />

          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Start</span>
          </Button>
        </header>
        <div className="min-h-screen bg-background p-6">
          <main className="max-w-5xl mx-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
