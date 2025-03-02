import { useState } from "react";
import "./App.css";
import Dashboard from "./views/dashboard";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppRouter from "./providers/routerProviders";

function App() {

  return (<AppRouter />
  );
}

export default App;
