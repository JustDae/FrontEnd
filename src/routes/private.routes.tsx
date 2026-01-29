import type { RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import CategoriesPage from "../pages/private/CategoriesPage";
<<<<<<< HEAD
import PostsPage from "../pages/private/PostsPage";
=======
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
import DetallePedido from "../pages/private/DetallePedido";
import UsersPage from "../pages/private/UsersPage";
import Forbidden from "../pages/private/Forbidden";
import RequireRole from "./RequireRole";
import PedidosPage from "../pages/private/PedidosPage";
import PublicProducts from "../pages/public/PublicProducts";
import ProductosPage from "../pages/private/ProductosPage";
import AuditLogsPage from "../pages/private/AuditLogsPage";
<<<<<<< HEAD
import MesaPage from "../pages/MesaPage";
import MetodoPagoPage from "../pages/MetodoPagoPage";
import NotificacionesPage from "../pages/NotificacionesPage";
import ResenasPage from "../pages/ResenasPage";
=======
import RolesPage from "../pages/private/RolesPage";
import RestaurantePage from "../pages/private/RestaurantePage";
import PromocionesPage from "../pages/private/PromocionesPage";
import FacturaPage from "../pages/private/FacturaPage.tsx";
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e

export const privateRoutes: RouteObject = {
  path: "/dashboard",
  children: [
    { index: true, element: <DashboardHome /> },
<<<<<<< HEAD
    { path: "categories", element: <CategoriesPage /> },
    { path: "productos", element: <ProductosPage /> },
    { path: "posts", element: <PostsPage /> },
    { path: "detalle-pedido/:id?", element: <DetallePedido /> }, 
=======
    { path: "productos", element: <ProductosPage /> },
    { path: "detalle-pedido/:id?", element: <DetallePedido /> },
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    { path: "forbidden", element: <Forbidden /> },
    { path: "pedidos", element: <PedidosPage/>},
    { path: "audit-logs", element: <AuditLogsPage /> },
    { path: "menu", element: <PublicProducts/>},
<<<<<<< HEAD
    { path: "mesa",  element: <MesaPage/>},
    { path: "metodo-pago", element: <MetodoPagoPage/>},
    { path: "notificaciones", element: <NotificacionesPage/>},
    { path: "resenas", element: <ResenasPage /> },
=======
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    {
      path: "users",
      element: (
        <RequireRole allow={["ADMIN"]}>
          <UsersPage />
        </RequireRole>
      ),
    },
<<<<<<< HEAD
  ],
}; 

=======
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
  ],
}; 
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
