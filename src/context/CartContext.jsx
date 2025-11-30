import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { api } from "../services/api";

// SAFETY NET: Default values to prevent "undefined" errors
const CartContext = createContext({
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  loading: false,
  setCart: () => {}
});

export function CartProvider({ children }) {
  const { user, token } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. LOAD CART
  useEffect(() => {
    async function loadCart() {
      if (user && token) {
        setLoading(true);
        try {
          const data = await api.db.get("cart_items", {
            select: "quantity,size,product:products(*)",
            user_id: `eq.${user.id}`
          }, token);
          
          if (data) {
            const formatted = data.map((item) => {
              const p = item.product;
              let stock = p.stock;
              if (p.variants && item.size) {
                 const v = p.variants.find((v) => v.size === item.size);
                 if (v) stock = Number(v.stock);
              }
              return { ...p, quantity: item.quantity, selectedSize: item.size, stock };
            });
            setCart(formatted);
          }
        } catch(e) { console.error("Cart load failed", e); }
        setLoading(false);
      } else {
        const saved = localStorage.getItem("reloved_cart_guest");
        setCart(saved ? JSON.parse(saved) : []);
      }
    }
    loadCart();
  }, [user, token]);

  // 2. SYNC LOCAL STORAGE (Guest)
  useEffect(() => {
    if (!user) localStorage.setItem("reloved_cart_guest", JSON.stringify(cart));
  }, [cart, user]);

  // 3. ADD TO CART
  const addToCart = async (product, quantity, size, maxStock) => {
    let newCart = [...cart];
    const idx = newCart.findIndex(i => String(i.id) === String(product.id) && i.selectedSize === size);
    
    if (idx > -1) {
      const newQ = newCart[idx].quantity + quantity;
      if (newQ > maxStock) {
        newCart[idx].quantity = maxStock;
        alert(`Stock limit reached. Max: ${maxStock}`);
      } else {
        newCart[idx].quantity = newQ;
      }
    } else {
      newCart.push({ ...product, quantity, selectedSize: size, stock: maxStock });
    }
    setCart(newCart);

    if (user && token) {
      const item = newCart.find(i => String(i.id) === String(product.id) && i.selectedSize === size);
      try {
        await api.db.upsert("cart_items", {
          user_id: user.id,
          product_id: product.id,
          size: size,
          quantity: item.quantity
        }, "user_id,product_id,size", token);
      } catch (e) {
        console.error("API error adding to cart", e);
      }
    }
  };

  // 4. REMOVE
  const removeFromCart = async (id, size) => {
    setCart(prev => prev.filter(i => !(String(i.id) === String(id) && i.selectedSize === size)));
    
    if (user && token) {
       const params = { user_id: `eq.${user.id}`, product_id: `eq.${id}` };
       if (size) params.size = `eq.${size}`;
       else params.size = `is.null`;
       
       try {
         await api.db.deleteWhere("cart_items", params, token);
       } catch (e) {
         console.error("API error removing cart item", e);
       }
    }
  };

  // 5. UPDATE QUANTITY
  const updateQuantity = async (id, size, delta) => {
    let newQty = 0;
    const newCart = cart.map(item => {
       if(String(item.id) === String(id) && item.selectedSize === size) {
         newQty = item.quantity + delta;
         if (newQty < 1) newQty = 1;
         if (newQty > item.stock) newQty = item.stock; 
         return { ...item, quantity: newQty };
       }
       return item;
    });
    setCart(newCart);

    if (user && token && newQty > 0) {
       const params = { user_id: `eq.${user.id}`, product_id: `eq.${id}` };
       if (size) params.size = `eq.${size}`;
       else params.size = `is.null`;
       
       try {
         await api.db.updateWhere("cart_items", params, { quantity: newQty }, token);
       } catch(e) {
         console.error("API error updating cart", e);
       }
    }
  };

  // 6. CLEAR CART
  const clearCart = async () => {
    setCart([]);
    if (user && token) {
      try {
        await api.db.deleteWhere("cart_items", { user_id: `eq.${user.id}` }, token);
      } catch (e) {
        console.error("API error clearing cart", e);
      }
    } else {
      localStorage.removeItem("reloved_cart_guest");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);