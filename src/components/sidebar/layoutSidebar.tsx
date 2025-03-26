import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { isTokenValid } from "../tokenInfo";

export default function LayoutSidebar() {
  const { user } = useUserContext()
  const actif = user?.actif


  if (user) {
    const tokenValid = isTokenValid(user.token)
    if (tokenValid) {
      if (actif == 1) {
        return (
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger className="bg-white" />
            <Outlet />
          </SidebarProvider>
        );
      } else {
        <>
          <div className="text-2xl text-black font-bold"> Erreur vus n'est pas référencé</div>
        </>
      }
    } else {
      <>
        <div className="text-2xl text-black font-bold"> Erreur veuillez vous reconnecter</div>
      </>
    }
  } else {
    <>
      <div className="text-2xl text-black font-bold"> Erreur veuillez vous reconnecter</div>
    </>
  }
}
