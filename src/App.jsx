import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";

export default function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  );
}
