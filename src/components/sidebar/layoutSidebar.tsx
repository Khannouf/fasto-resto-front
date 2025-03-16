import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "../sidebar/app-sidebar"

export default function LayoutSidebar({ children }: { children: React.ReactNode }) {
  return (
    
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger className="bg-white"/>
        {children}
    </SidebarProvider>
  )
}
