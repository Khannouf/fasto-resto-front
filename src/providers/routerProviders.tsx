import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Dashboard from "../views/dashboard";
import React from "react";
import LayoutSidebar from "../components/sidebar/layoutSidebar";
import LayoutWithBottomBar from "../components/bottomBar/layoutBottomBar";
import FirstStep from "../views/espaceClient/firstStep";
import RestaurantMenu from "../views/espaceClient/restaurantMenu";
import DetailDish from "../views/espaceClient/detailDish";
import { RecapBeforeOrder } from "../views/espaceClient/recapBeforeOrder";

// Composant qui contient toute la logique
const AppContent: React.FC = () => {
  const location = useLocation();
  const user = true; // récupérer le contexte utilisateur
  const admin = false;


  const isRestaurantRoute = location.pathname.startsWith("/restaurant");
  const isRestaurantRouteOrder = location.pathname.startsWith("/order");


  if (isRestaurantRoute) {
    return (
      <>

        <LayoutWithBottomBar>
          <Routes>
            <Route path="/restaurant/:idResto" element={<FirstStep />} />
            <Route path="/restaurant/:idResto/menu" element={<RestaurantMenu />} />
            <Route path="/restaurant/:idResto/:idElement" element={<DetailDish />} />
          </Routes>
        </LayoutWithBottomBar>
      </>
    );
  }

  if (isRestaurantRouteOrder) {
    return (
      <Routes>
        <Route path="/order/:idResto/recapBeforeOrder" element={<RecapBeforeOrder />} />
      </Routes>
    )
  }

  if (admin) {

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
  }
};

// AppRouter gère uniquement <Router>
const AppRouter: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRouter;
