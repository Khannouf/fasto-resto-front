import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import { Outlet, Link } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { isTokenValid } from "../tokenInfo";
import { Button } from "../ui/button";

export default function LayoutSidebar() {
  const { user } = useUserContext();

  if (!user) {
    return <ErrorMessage message="Erreur : veuillez vous reconnecter" />;
  }

  const tokenValid = isTokenValid(user.token);
  
  if (!tokenValid) {
    return <ErrorMessage message="Erreur : votre session a expiré, veuillez vous reconnecter" />;
  }

  if (user.actif !== 1) {
    return <ErrorMessage message="Erreur : votre compte n'est pas actif" />;
  }

  // ✅ Si tout est bon, on affiche le layout avec la sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="bg-white" />
      <Outlet />
    </SidebarProvider>
  );
}

// 🛠 Composant pour afficher les erreurs avec un bouton
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{message}</h2>
        <Link to="/login">
          <Button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Reconnexion
          </Button>
        </Link>
      </div>
    </div>
  );
}
