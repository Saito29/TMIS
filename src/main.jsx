import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "../app/authentication/App.jsx";
import Register from "../app/authentication/Register.jsx";
import ForgetPassword from "../app/authentication/ForgetPassword.jsx";
import "./auth.css";

const routes = {
  "/": Login,
  "/register": Register,
  "/forget-password": ForgetPassword,
};
const Page = routes[window.location.pathname] || Login;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
