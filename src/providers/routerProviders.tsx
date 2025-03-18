import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Dashboard from "../views/espaceAdmin/dashboard";
import React from "react";
import LayoutSidebar from "../components/sidebar/layoutSidebar";
import LayoutWithBottomBar from "../components/bottomBar/layoutBottomBar";
import FirstStep from "../views/espaceClient/firstStep";
import RestaurantMenu from "../views/espaceClient/restaurantMenu";
import DetailDish from "../views/espaceClient/detailDish";
import { RecapBeforeOrder } from "../views/espaceClient/recapBeforeOrder";
import { Category } from "../views/espaceAdmin/category";
import { TablesView } from "../views/espaceAdmin/tables";
import QRCodeGenerator from "../components/qrCodeGenerator";

// Composant qui contient toute la logique
const AppContent: React.FC = () => {
  const location = useLocation();
  const user = true; // récupérer le contexte utilisateur


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

  if (user) {


    return (
      <>
        <LayoutSidebar>
          <Routes>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/categories" element={<Category />} />
            <Route path="/admin/tables" element={<TablesView />} />
            <Route path="/admin/tables/qrcode/:idResto/:numTable" element={<QRCodeGenerator />} />

          </Routes>
        </LayoutSidebar>
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
