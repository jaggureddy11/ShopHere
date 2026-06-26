import { create } from 'zustand';
import { IUser } from '../types';
import axios from 'axios';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  loginUser: (user: IUser, token: string) => void;
  logoutUser: () => void;
  setError: (error: string | null) => void;
}

const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

const getInitialUser = (): IUser | null => {
  try {
    const raw = getLocalStorage('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  accessToken: getLocalStorage('accessToken'),
  isAuthenticated: !!getLocalStorage('accessToken'),
  isLoading: false,
  error: null,

  setAccessToken: (token) => {
    if (token) {
      setLocalStorage('accessToken', token);
    } else {
      removeLocalStorage('accessToken');
    }
    set({ accessToken: token, isAuthenticated: !!token });
  },

  setUser: (user) => {
    if (user) {
      setLocalStorage('user', JSON.stringify(user));
    } else {
      removeLocalStorage('user');
    }
    set({ user });
  },

  loginUser: (user, token) => {
    setLocalStorage('accessToken', token);
    setLocalStorage('user', JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true, error: null });
  },

  logoutUser: () => {
    removeLocalStorage('accessToken');
    removeLocalStorage('user');
    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
  },

  setError: (error) => set({ error })
}));
