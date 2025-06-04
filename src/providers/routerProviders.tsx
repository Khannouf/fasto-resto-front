import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
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
import { Schedules } from "../views/espaceAdmin/schedules";
import LayoutNavbar from "../components/navbar/layoutNavbar";
import { Login } from "../views/espaceAccueil/login";
import { Register } from "../views/espaceAccueil/register";
import { Dishes } from "../views/espaceAdmin/dishes";
import { Menus } from "../views/espaceAdmin/menu";

// Composant qui contient toute la logique
const AppContent: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/restaurant/:idResto" element={<LayoutWithBottomBar />}>
          <Route index element={<FirstStep />} />
          <Route path="menu" element={<RestaurantMenu />} />
          <Route path=":idElement" element={<DetailDish />} />
        </Route>
        <Route
          path="/order/:idResto/recapBeforeOrder"
          element={<RecapBeforeOrder />}
        ></Route>
        <Route path="/admin" element={<LayoutSidebar />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<Menus />} />
          <Route path="categories" element={<Category />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="tables" element={<TablesView />} />
          <Route path="dishes" element={<Dishes />} />
          <Route
            path="tables/qrcode/:idResto/:numTable"
            element={<QRCodeGenerator />}
          />
        </Route>
        <Route path="/" element={<LayoutNavbar />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
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
