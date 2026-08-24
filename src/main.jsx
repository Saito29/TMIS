import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "../app/authentication/App.jsx";
import Register from "../app/authentication/Register.jsx";
import "./auth.css";

const Page = window.location.pathname === "/register" ? Register : Login;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
