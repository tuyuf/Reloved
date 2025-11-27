import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("reloved_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("reloved_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = null) => {
    setCart((prevCart) => {
      // Cek apakah item dengan ID dan Size yang sama sudah ada
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Jika ada, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Jika belum, tambah item baru
        return [...prevCart, { ...product, quantity, selectedSize: size }];
      }
    });
  };

  const removeFromCart = (id, size = null) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.id === id && item.selectedSize === size))
    );
  };

  const updateQuantity = (id, size, delta) => {
     setCart(prevCart => prevCart.map(item => {
        if (item.id === id && item.selectedSize === size) {
           const newQty = item.quantity + delta;
           return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
     }));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);