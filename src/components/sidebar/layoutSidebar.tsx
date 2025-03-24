import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import { Outlet } from "react-router-dom";

export default function LayoutSidebar() {
  const user = true;

  if (user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="bg-white" />
        <Outlet />
      </SidebarProvider>
    );
  } else {
    <div> Erreur pas admin</div>
  }
}
