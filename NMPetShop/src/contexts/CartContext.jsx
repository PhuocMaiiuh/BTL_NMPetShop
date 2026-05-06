import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => String(item.id) === String(product.id));
      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedPromo(null);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        selectedPromo,
        setSelectedPromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
