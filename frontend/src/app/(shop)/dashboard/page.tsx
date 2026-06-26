'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional()
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean()
});

type ProfileFields = z.infer<typeof profileSchema>;
type AddressFields = z.infer<typeof addressSchema>;

export default function UserDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, setUser, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors }
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema)
  });

  // Add Address Form
  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors }
  } = useForm<AddressFields>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'United States', isDefault: false }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.info('Please sign in to view your dashboard.');
        router.push('/login?redirect=/dashboard');
      } else if (user) {
        setProfileValue('name', user.name);
        setProfileValue('phone', user.phone || '');
      }
    }
  }, [mounted, isAuthenticated, user, setProfileValue, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const onUpdateProfile = async (data: ProfileFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.put('/users/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile details updated successfully.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const onAddAddress = async (data: AddressFields) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/users/addresses', data);
      if (res.data.success) {
        toast.success('Address added successfully.');
        
        // Refresh User profile in state
        const profileRes = await axiosInstance.get('/users/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }

        setShowAddressForm(false);
        resetAddressForm();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const res = await axiosInstance.put(`/users/addresses/${addressId}`, { isDefault: true });
      if (res.data.success) {
        toast.success('Default address updated.');
        const profileRes = await axiosInstance.get('/users/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update default address.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await axiosInstance.delete(`/users/addresses/${addressId}`);
      if (res.data.success) {
        toast.success('Address deleted.');
        const profileRes = await axiosInstance.get('/users/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-outline-variant pb-6">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Edit Profile details */}
        <div className="lg:col-span-5 border border-outline-variant p-6 md:p-8 shadow-editorial bg-white">
          <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2 mb-6">
            Profile Credentials
          </h3>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary">
                Email Address (Read-only)
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-outline-variant bg-surface-dim/50 px-3 py-2.5 text-xs text-outline outline-none rounded-none"
                value={user?.email || ''}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-primary">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none"
                placeholder="John Doe"
                {...registerProfile('name')}
              />
              {profileErrors.name && (
                <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-primary">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none"
                placeholder="123-456-7890"
                {...registerProfile('phone')}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary disabled:bg-outline text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
            >
              {submitting ? 'Updating details...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Right Column: Address book */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Address Book
            </h3>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-xs font-bold uppercase text-accent hover:underline flex items-center gap-1 focus:outline-none"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Address
              </button>
            )}
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit(onAddAddress)} className="border border-outline-variant p-6 space-y-4 bg-surface-dim shadow-editorial">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">New Address</h4>

              <div className="space-y-1">
                <label htmlFor="street" className="block text-[10px] font-bold uppercase tracking-widest">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                  placeholder="123 Main St"
                  {...registerAddress('street')}
                />
                {addressErrors.street && (
                  <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{addressErrors.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="city" className="block text-[10px] font-bold uppercase tracking-widest">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                    placeholder="New York"
                    {...registerAddress('city')}
                  />
                  {addressErrors.city && (
                    <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{addressErrors.city.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="state" className="block text-[10px] font-bold uppercase tracking-widest">
                    State / Region
                  </label>
                  <input
                    id="state"
                    type="text"
                    className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                    placeholder="NY"
                    {...registerAddress('state')}
                  />
                  {addressErrors.state && (
                    <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{addressErrors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="zip" className="block text-[10px] font-bold uppercase tracking-widest">
                    ZIP / Postal Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                    placeholder="10001"
                    {...registerAddress('postalCode')}
                  />
                  {addressErrors.postalCode && (
                    <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{addressErrors.postalCode.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="country" className="block text-[10px] font-bold uppercase tracking-widest">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                    placeholder="United States"
                    {...registerAddress('country')}
                  />
                  {addressErrors.country && (
                    <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{addressErrors.country.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  {...registerAddress('isDefault')}
                />
                <label htmlFor="isDefault" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all rounded-none"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    resetAddressForm();
                  }}
                  className="border border-outline-variant text-outline hover:text-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {user && user.addresses.length > 0 ? (
            <div className="space-y-4">
              {user.addresses.map((addr) => (
                <div key={addr._id} className="p-4 border border-outline-variant flex justify-between items-start">
                  <div className="text-xs font-semibold uppercase tracking-wider text-outline-variant leading-relaxed">
                    <div>{addr.street}</div>
                    <div>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </div>
                    <div>{addr.country}</div>
                    {addr.isDefault && (
                      <span className="inline-block mt-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5">
                        Default Address
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr._id || '')}
                        className="text-[9px] font-bold uppercase text-accent hover:underline focus:outline-none"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr._id || '')}
                      className="text-[9px] font-bold uppercase text-red-600 hover:underline focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-dim p-8 text-center text-xs text-outline font-semibold uppercase tracking-widest">
              No addresses saved in your address book.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
