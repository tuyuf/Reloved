import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { supabase } from "../lib/supabase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. LOAD CART (Database vs LocalStorage)
  useEffect(() => {
    async function loadCart() {
      if (user) {
        setLoading(true);
        // Ambil data dari Supabase (Join dengan tabel Products)
        const { data, error } = await supabase
          .from("cart_items")
          .select("quantity, size, product:products(*)")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading cart:", error);
        } else if (data) {
          // Format data dari DB agar sesuai struktur state Cart di frontend
          const formattedCart = data.map((item) => {
            const product = item.product;
            
            // Cari stok yang sesuai varian/size
            let maxStock = product.stock;
            if (product.variants && item.size) {
               const variant = product.variants.find((v) => v.size === item.size);
               if (variant) maxStock = Number(variant.stock);
            }

            return {
              ...product,
              quantity: item.quantity,
              selectedSize: item.size,
              stock: maxStock, // Penting untuk validasi
            };
          });
          setCart(formattedCart);
        }
        setLoading(false);
      } else {
        // Fallback ke LocalStorage untuk Guest
        const savedCart = localStorage.getItem("reloved_cart_guest");
        setCart(savedCart ? JSON.parse(savedCart) : []);
      }
    }

    loadCart();
  }, [user]);

  // 2. SIMPAN KE LOCALSTORAGE (Hanya untuk Guest)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("reloved_cart_guest", JSON.stringify(cart));
    }
  }, [cart, user]);

  // --- FUNGSI ADD TO CART ---
  const addToCart = async (product, quantity, size, maxStock) => {
    // A. Update State Lokal (Optimistic UI)
    let newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) => String(item.id) === String(product.id) && item.selectedSize === size
    );

    let finalQty = quantity;

    if (existingIndex > -1) {
      const currentQty = newCart[existingIndex].quantity;
      const potentialQty = currentQty + quantity;

      if (potentialQty > maxStock) {
        if (currentQty < maxStock) {
          finalQty = maxStock - currentQty; // Tambahkan sisa yg mungkin
          newCart[existingIndex].quantity = maxStock;
          alert(`Stok terbatas! Keranjang dimaksimalkan ke ${maxStock}.`);
        } else {
          alert("Keranjang sudah penuh sesuai stok tersedia.");
          return; // Stop eksekusi
        }
      } else {
        newCart[existingIndex].quantity = potentialQty;
      }
    } else {
      const safeQty = Math.min(quantity, maxStock);
      if (safeQty < quantity) alert(`Stok tersisa ${maxStock}. Jumlah disesuaikan.`);
      
      if (safeQty > 0) {
        finalQty = safeQty; // Untuk dipakai di DB query
        newCart.push({ 
            ...product, 
            quantity: safeQty, 
            selectedSize: size, 
            stock: maxStock 
        });
      } else {
        return; // Stop jika qty 0
      }
    }

    setCart(newCart);

    // B. Sinkronisasi ke Supabase (Jika User Login)
    if (user) {
      // Kita hitung quantity total yang baru untuk item ini
      const itemInCart = newCart.find(
        (item) => String(item.id) === String(product.id) && item.selectedSize === size
      );
      const qtyToSave = itemInCart.quantity;

      const { error } = await supabase.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: product.id,
          size: size,
          quantity: qtyToSave,
        },
        { onConflict: "user_id, product_id, size" } // Kunci unique constraint
      );

      if (error) console.error("Gagal simpan ke DB:", error);
    }
  };

  // --- FUNGSI REMOVE ---
  const removeFromCart = async (id, size) => {
    // Update Lokal
    setCart((prev) => prev.filter((item) => !(String(item.id) === String(id) && item.selectedSize === size)));

    // Update DB
    if (user) {
      let query = supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
      
      if (size) query = query.eq("size", size);
      else query = query.is("size", null);

      const { error } = await query;
      if (error) console.error("Gagal hapus dari DB:", error);
    }
  };

  // --- FUNGSI UPDATE QUANTITY ---
  const updateQuantity = async (id, size, delta) => {
    let newQty = 0;
    
    // Update Lokal
    const newCart = cart.map((item) => {
      if (String(item.id) === String(id) && item.selectedSize === size) {
        const maxLimit = item.stock || 999;
        const calculatedQty = item.quantity + delta;

        if (calculatedQty > maxLimit) {
          alert(`Maksimal stok tersedia: ${maxLimit}`);
          newQty = item.quantity;
          return item;
        }
        if (calculatedQty < 1) {
          newQty = 0; // Tanda untuk dihapus nanti jika perlu, tapi logic UI biasanya menahan di 1
          return item;
        }
        
        newQty = calculatedQty;
        return { ...item, quantity: calculatedQty };
      }
      return item;
    });

    setCart(newCart);

    // Update DB
    if (user && newQty > 0) {
      let query = supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("user_id", user.id)
        .eq("product_id", id);

      if (size) query = query.eq("size", size);
      else query = query.is("size", null);

      await query;
    }
  };

  // --- FUNGSI CLEAR CART ---
  const clearCart = async () => {
    setCart([]);
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    } else {
      localStorage.removeItem("reloved_cart_guest");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);