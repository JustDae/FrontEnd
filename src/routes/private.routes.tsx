import type { RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import CategoriesPage from "../pages/private/CategoriesPage";
import PostsPage from "../pages/private/PostsPage";
import DetallePedido from "../pages/private/DetallePedido";
import UsersPage from "../pages/private/UsersPage";
import Forbidden from "../pages/private/Forbidden";
import RequireRole from "./RequireRole";
import PedidosPage from "../pages/private/PedidosPage";
import PublicProducts from "../pages/public/PublicProducts";
import ProductosPage from "../pages/private/ProductosPage";
import AuditLogsPage from "../pages/private/AuditLogsPage";

export const privateRoutes: RouteObject = {
  path: "/dashboard",
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "productos", element: <ProductosPage /> },
    { path: "posts", element: <PostsPage /> },
    { path: "detalle-pedido/:id?", element: <DetallePedido /> }, 
    { path: "forbidden", element: <Forbidden /> },
    { path: "pedidos", element: <PedidosPage/>},
    { path: "audit-logs", element: <AuditLogsPage /> },
    { path: "menu", element: <PublicProducts/>},
    {
      path: "users",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <UsersPage />
        </RequireRole>
      ),
    },
    {
      path: "categories",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <CategoriesPage />
        </RequireRole>
      ),
    },
  ],
}; 