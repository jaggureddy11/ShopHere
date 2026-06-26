'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type ForgotFields = z.infer<typeof forgotSchema>;
type ResetFields = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [devToken, setDevToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const forgotForm = useForm<ForgotFields>({
    resolver: zodResolver(forgotSchema)
  });

  const resetForm = useForm<ResetFields>({
    resolver: zodResolver(resetSchema)
  });

  const handleForgotSubmit = async (data: ForgotFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', data);
      if (res.data.success) {
        toast.success('Reset email has been dispatched!');
        setResetEmail(data.email);
        
        // Save the dev token to fill for local testing convenience
        if (res.data.token) {
          setDevToken(res.data.token);
          resetForm.setValue('token', res.data.token);
        }

        resetForm.setValue('email', data.email);
        setStep(2);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error processing request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (data: ResetFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/reset-password', data);
      if (res.data.success) {
        toast.success('Password reset completed successfully! You can now log in.');
        setStep(1);
        forgotForm.reset();
        resetForm.reset();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error resetting password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white text-primary">
      <div className="max-w-md w-full border border-outline-variant p-8 md:p-12 shadow-editorial">
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Recover Password</h2>
              <p className="mt-2 text-xs text-outline font-semibold uppercase tracking-wider">
                We will email you a reset code token
              </p>
            </div>

            <form className="space-y-6" onSubmit={forgotForm.handleSubmit(handleForgotSubmit)}>
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
                  {...forgotForm.register('email')}
                />
                {forgotForm.formState.errors.email && (
                  <p className="text-xs text-red-600 font-bold uppercase mt-1">
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
              >
                {submitting ? 'Sending Request...' : 'Send Recovery Token'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Reset Password</h2>
              <p className="mt-2 text-xs text-outline font-semibold uppercase tracking-wider">
                Enter your recovery token and choose a new password
              </p>
            </div>

            {devToken && (
              <div className="mb-4 bg-surface-dim p-3 border border-outline-variant text-[11px] font-semibold text-primary break-all">
                <span className="font-bold text-accent">DEV RESET TOKEN:</span> {devToken}
              </div>
            )}

            <form className="space-y-4" onSubmit={resetForm.handleSubmit(handleResetSubmit)}>
              <input type="hidden" {...resetForm.register('email')} />

              <div className="space-y-1">
                <label htmlFor="token" className="block text-xs font-bold uppercase tracking-widest text-primary">
                  Reset Token
                </label>
                <input
                  id="token"
                  type="text"
                  className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
                  placeholder="Enter the reset token"
                  {...resetForm.register('token')}
                />
                {resetForm.formState.errors.token && (
                  <p className="text-xs text-red-600 font-bold uppercase mt-1">
                    {resetForm.formState.errors.token.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-primary">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-none"
                  placeholder="••••••••"
                  {...resetForm.register('password')}
                />
                {resetForm.formState.errors.password && (
                  <p className="text-xs text-red-600 font-bold uppercase mt-1">
                    {resetForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
              >
                {submitting ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6 pt-6 border-t border-outline-variant text-xs text-outline font-semibold">
          Remembered your password?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline uppercase tracking-wider">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
