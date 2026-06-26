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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
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
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/register', data);
      if (res.data.success) {
        const { user, accessToken } = res.data;
        loginUser(user, accessToken);

        toast.success(`Account created successfully. Welcome, ${user.name}!`);

        // Sync local guest cart and wishlist
        await syncCart();
        await fetchCart();
        await fetchWishlist();

        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white text-primary">
      <div className="max-w-md w-full border border-outline-variant p-8 md:p-12 shadow-editorial">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Register</h2>
          <p className="mt-2 text-xs text-outline font-semibold uppercase tracking-wider">
            Create an account to check out and track orders
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-primary">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
              placeholder="John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-bold uppercase mt-1">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-primary">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
              placeholder="123-456-7890"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 font-bold uppercase mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1 relative">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-primary">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-outline-variant text-xs text-outline font-semibold">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline uppercase tracking-wider">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
