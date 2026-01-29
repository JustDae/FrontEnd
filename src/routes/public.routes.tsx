import type { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PublicHome from "../pages/public/PublicHome";
<<<<<<< HEAD
import PublicPostDetail from "../pages/public/PublicPostDetail";
=======
import PublicAbout from "../pages/public/PublicAbout";
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
import PublicOrderDetail from "../pages/public/PublicOrderDetail";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <PublicHome /> },
<<<<<<< HEAD
    { path: "posts/:id", element: <PublicPostDetail /> },
=======
    { path: "about", element: <PublicAbout /> },
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    { path: "order-detail/:id", element: <PublicOrderDetail /> },
    { path: "auth/login", element: <Login /> },
    { path: "auth/register", element: <Register /> },
  ],
};