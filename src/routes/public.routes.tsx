import type { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PublicHome from "../pages/public/PublicHome";
import PublicAbout from "../pages/public/PublicAbout";
import PublicOrderDetail from "../pages/public/PublicOrderDetail";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <PublicHome /> },
    { path: "about", element: <PublicAbout /> },
    { path: "order-detail/:id", element: <PublicOrderDetail /> },
    { path: "auth/login", element: <Login /> },
    { path: "auth/register", element: <Register /> },
  ],
};