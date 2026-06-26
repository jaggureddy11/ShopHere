import { create } from 'zustand';
import { IProduct } from '../types';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from './authStore';

interface WishlistState {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: IProduct) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const getLocalStorageWishlist = (): IProduct[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const setLocalStorageWishlist = (products: IProduct[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(products));
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  products: getLocalStorageWishlist(),
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      set({ products: getLocalStorageWishlist() });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/wishlist');
      if (res.data.success) {
        set({ products: res.data.wishlist.products, isLoading: false });
        setLocalStorageWishlist(res.data.wishlist.products);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', isLoading: false });
    }
  },

  addToWishlist: async (product) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const currentList = [...get().products];
      if (!currentList.some(p => p._id === product._id)) {
        currentList.push(product);
      }
      set({ products: currentList });
      setLocalStorageWishlist(currentList);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(`/wishlist/${product._id}`);
      if (res.data.success) {
        set({ products: res.data.wishlist.products, isLoading: false });
        setLocalStorageWishlist(res.data.wishlist.products);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add to wishlist', isLoading: false });
    }
  },

  removeFromWishlist: async (productId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const currentList = get().products.filter(p => p._id !== productId);
      set({ products: currentList });
      setLocalStorageWishlist(currentList);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      if (res.data.success) {
        set({ products: res.data.wishlist.products, isLoading: false });
        setLocalStorageWishlist(res.data.wishlist.products);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove from wishlist', isLoading: false });
    }
  },

  isInWishlist: (productId) => {
    return get().products.some((p) => p._id === productId);
  }
}));
