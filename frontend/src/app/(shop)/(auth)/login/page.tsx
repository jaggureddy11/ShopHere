'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/utils/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuthStore();
  const { syncCart, fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/login', data);
      if (res.data.success) {
        const { user, accessToken } = res.data;
        loginUser(user, accessToken);
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Sync local guest cart and wishlist
        await syncCart();
        await fetchCart();
        await fetchWishlist();

        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          const redirect = searchParams.get('redirect') || '/';
          router.push(redirect);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white text-primary">
      <div className="max-w-md w-full border border-outline-variant p-8 md:p-12 shadow-editorial">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Sign In</h2>
          <p className="mt-2 text-xs text-outline font-semibold uppercase tracking-wider">
            Access your profile and track order statuses
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-primary">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
              placeholder="name@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-bold uppercase mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1 relative">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-primary">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] font-bold uppercase text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full border border-outline-variant pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-outline hover:text-primary focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 font-bold uppercase mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-outline-variant text-xs text-outline font-semibold">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-bold hover:underline uppercase tracking-wider">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
