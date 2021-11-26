import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutComponent from "./page/Layout/Layout";
import Login from "./page/Login/Login";

function App() {
  const loaction = useLocation();
  const nvigate = useNavigate();
  return (
    <div>
      {loaction.pathname === "/login" ? (
        <Login></Login>
      ) : (
        <LayoutComponent></LayoutComponent>
      )}
    </div>
  );
}
export default App;
