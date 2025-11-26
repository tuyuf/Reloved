import { createBrowserRouter } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/home/Home";
import Collections from "./pages/collections/Collections";
import ProductDetail from "./pages/product/ProductDetail";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminProducts from "./admin/products/AdminProducts";
import AddProduct from "./admin/products/AddProduct";
import EditProduct from "./admin/products/EditProduct";
import AdminOrders from "./admin/orders/AdminOrders";
import VerifyPayment from "./admin/orders/VerifyPayment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "collections", element: <Collections /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "products/edit/:id", element: <EditProduct /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "orders/verify/:id", element: <VerifyPayment /> },
    ],
  },
]);


export default router;
