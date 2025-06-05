import { createContext, useContext, useState, useEffect } from 'react'; // Añadido useEffect aquí

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Añadido el useEffect para calcular el total y contar items
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.precio, 0);
    setTotal(newTotal);
    setCartItemCount(cart.length);
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const value = {
    cart,
    total,
    addToCart,
    showCart,
    setShowCart,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};