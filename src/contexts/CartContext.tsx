import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '@/lib/marketplaceData';

export interface CartItem {
  product: Product;
  quantity: number;
  plan: 'monthly' | 'yearly' | 'lifetime';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, plan?: CartItem['plan']) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showMiniCart: boolean;
  setShowMiniCart: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showMiniCart, setShowMiniCart] = useState(false);

  const addToCart = useCallback((product: Product, plan: CartItem['plan'] = 'yearly') => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev;
      return [...prev, { product, quantity: 1, plan }];
    });
    setShowMiniCart(true);
    setTimeout(() => setShowMiniCart(false), 3000);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => {
    if (item.plan === 'monthly') return sum + item.product.subscription.monthly;
    if (item.plan === 'yearly') return sum + item.product.subscription.yearly;
    return sum + item.product.price;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice, showMiniCart, setShowMiniCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
