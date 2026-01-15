import type { RouteObject } from "react-router-dom";
import { PostDetail } from "../pages/public/PostDetail";
import PublicLayout from "../layouts/PublicLayout";
import { Home } from "../pages/public/Home";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "post/:id", element: <PostDetail /> },
  ],
};