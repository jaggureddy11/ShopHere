import { create } from 'zustand';
import { ICartItem, IProduct } from '../types';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from './authStore';

interface CartState {
  items: ICartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (product: IProduct, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  getCartSubtotal: () => number;
  getCartCount: () => number;
}

const getLocalStorageCart = (): ICartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const setLocalStorageCart = (items: ICartItem[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getLocalStorageCart(),
  isLoading: false,
  error: null,

  fetchCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      set({ items: getLocalStorageCart() });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/cart');
      if (res.data.success) {
        set({ items: res.data.cart.items, isLoading: false });
        setLocalStorageCart(res.data.cart.items);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    
    if (!isAuthenticated) {
      const currentItems = [...get().items];
      const itemIndex = currentItems.findIndex(item => item.product._id === product._id);

      if (itemIndex > -1) {
        currentItems[itemIndex].quantity += quantity;
      } else {
        currentItems.push({
          product,
          quantity,
          addedAt: new Date().toISOString()
        });
      }

      set({ items: currentItems });
      setLocalStorageCart(currentItems);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/cart/items', {
        productId: product._id,
        quantity
      });
      if (res.data.success) {
        set({ items: res.data.cart.items, isLoading: false });
        setLocalStorageCart(res.data.cart.items);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add item', isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const currentItems = get().items.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });

      set({ items: currentItems });
      setLocalStorageCart(currentItems);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/cart/items/${productId}`, { quantity });
      if (res.data.success) {
        set({ items: res.data.cart.items, isLoading: false });
        setLocalStorageCart(res.data.cart.items);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update item quantity', isLoading: false });
    }
  },

  removeItem: async (productId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const currentItems = get().items.filter(item => item.product._id !== productId);
      set({ items: currentItems });
      setLocalStorageCart(currentItems);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/cart/items/${productId}`);
      if (res.data.success) {
        set({ items: res.data.cart.items, isLoading: false });
        setLocalStorageCart(res.data.cart.items);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove item', isLoading: false });
    }
  },

  clearCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      set({ items: [] });
      setLocalStorageCart([]);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.delete('/cart');
      if (res.data.success) {
        set({ items: [], isLoading: false });
        setLocalStorageCart([]);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to clear cart', isLoading: false });
    }
  },

  syncCart: async () => {
    const localItems = getLocalStorageCart();
    if (localItems.length === 0) return;

    try {
      // Sync each item to backend
      for (const item of localItems) {
        await axiosInstance.post('/cart/items', {
          productId: item.product._id,
          quantity: item.quantity
        });
      }
      // Refresh the cart from backend
      const res = await axiosInstance.get('/cart');
      if (res.data.success) {
        set({ items: res.data.cart.items });
        setLocalStorageCart(res.data.cart.items);
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  },

  getCartSubtotal: () => {
    return get().items.reduce((total, item) => {
      const activePrice = item.product.discountPrice || item.product.price;
      return total + activePrice * item.quantity;
    }, 0);
  },

  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
