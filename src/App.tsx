import { ConfirmProvider } from "@/components/common/ConfirmProvider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="app-root">
      <ConfirmProvider />
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
