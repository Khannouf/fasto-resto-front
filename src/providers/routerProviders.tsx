import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../views/dashboard";
import React from "react";
import LayoutSidebar from "../components/sidebar/layoutSidebar";

// Router avec Layout
const AppRouter: React.FC = () => {
  const user = true; //recuperer le context de user

  return (
    <Router>
      {user ? (
        <LayoutSidebar>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </LayoutSidebar>
      ) : (
        <LayoutSidebar>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/dashboard2" element={<Dashboard />} />
          </Routes>
        </LayoutSidebar>
      )}
    </Router>
  );
};

export default AppRouter;
