import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../views/dashboard";
import React from "react";
import LayoutSidebar from "../components/sidebar/layoutSidebar";
import LayoutWithBottomBar from "../components/bottomBar/layoutBottomBar";
import FirstStep from "../views/espaceClient/firstStep";

// Composant qui contient toute la logique
const AppContent: React.FC = () => {
  const location = useLocation();
  const user = true; // récupérer le contexte utilisateur

  const isRestaurantRoute = location.pathname.startsWith("/restaurant");

  if (isRestaurantRoute) {
    return (
      <LayoutWithBottomBar>
        <Routes>
          <Route path="/restaurant/idresto" element={<FirstStep />} />
        </Routes>
      </LayoutWithBottomBar>
    );
  }

  return (
    <>
      {user ? (
        <LayoutSidebar>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </LayoutSidebar>
      ) : (
        <LayoutSidebar>
          <Routes>
            <Route path="/dashboard2" element={<Dashboard />} />
          </Routes>
        </LayoutSidebar>
      )}
    </>
  );
};

// AppRouter gère uniquement <Router>
const AppRouter: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRouter;
