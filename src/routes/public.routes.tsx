import type { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PublicHome from "../pages/public/PublicHome";
import PublicPostDetail from "../pages/public/PublicPostDetail";
import PublicOrderDetail from "../pages/public/PublicOrderDetail";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <PublicHome /> },
    { path: "posts/:id", element: <PublicPostDetail /> },
    { path: "order-detail/:id", element: <PublicOrderDetail /> },
    { path: "auth/login", element: <Login /> },
    { path: "auth/register", element: <Register /> },
  ],
};