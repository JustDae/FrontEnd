import type { RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import CategoriesPage from "../pages/private/CategoriesPage";
import DetallePedido from "../pages/private/DetallePedido";
import UsersPage from "../pages/private/UsersPage";
import Forbidden from "../pages/private/Forbidden";
import RequireRole from "./RequireRole";
import PedidosPage from "../pages/private/PedidosPage";
import PublicProducts from "../pages/public/PublicProducts";
import ProductosPage from "../pages/private/ProductosPage";
import AuditLogsPage from "../pages/private/AuditLogsPage";
import RolesPage from "../pages/private/RolesPage";
import RestaurantePage from "../pages/private/RestaurantePage";
import PromocionesPage from "../pages/private/PromocionesPage";
import FacturaPage from "../pages/private/FacturaPage";
import MesaPage from "../pages/private/MesaPage";
import MetodoPagoPage from "../pages/private/MetodoPagoPage";

export const privateRoutes: RouteObject = {
  path: "/dashboard",
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "productos", element: <ProductosPage /> },
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
      path: "roles",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <RolesPage />
        </RequireRole>
      ),
    },
    {
      path: "restaurante",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <RestaurantePage />
        </RequireRole>
      ),
    },
    {
      path: "promociones",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <PromocionesPage />
        </RequireRole>
      ),
    },
    {
      path: "facturas",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <FacturaPage />
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
    {
      path: "mesa",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <MesaPage />
        </RequireRole>
        ),
    },
    {
      path: "metodo-pago",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <MetodoPagoPage />
        </RequireRole>
      ),
    },
  ],
}; 
