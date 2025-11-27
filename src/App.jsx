import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";
import SmoothScroll from "./components/SmoothScroll";

export default function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <SmoothScroll>
            <RouterProvider router={router} />
          </SmoothScroll>
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  );
}