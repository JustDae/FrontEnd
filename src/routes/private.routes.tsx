import type {RouteObject} from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import CategoriesPage from "../pages/private/CategoriesPage";
import PostsPage from "../pages/private/PostsPage";
import UsersPage from "../pages/private/UsersPage";
import Forbidden from "../pages/private/Forbidden";
import RequireRole from "./RequireRole";

export const privateRoutes: RouteObject = {
  path: "/dashboard",
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "categories", element: <CategoriesPage /> },
    { path: "posts", element: <PostsPage /> },
    { path: "forbidden", element: <Forbidden /> },
    {
      path: "users",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <UsersPage />
        </RequireRole>
      ),
    },
  ],
};