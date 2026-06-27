'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_51TkUpyLmK5BB3Unpenm87NErgRHkrQky8QhnIoI2j9tKBkgwqO81Y8X5OJDdsic1ClgwAeSkdqZlhcIrFwxh67ry00ZqUJWiBC');

// Google Pay SVG logo
const GooglePayLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 45 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.2 9.1c0-.6-.1-1.1-.2-1.6H8.2c-.3 0-.6.1-.9.2L3.1 4.5C2.1 5.9 1.5 7.5 1.5 9.3s.6 3.4 1.6 4.8l4.2-3.2C7 10.4 6.8 9.8 6.8 9.1z" fill="#EA4335"/>
    <path d="M15.2 4.2c-2.4 0-4.4 1.4-5.2 3.4L5.7 3.2C7.3 1.3 9.7 0 12.5 0c2.7 0 5 .9 6.8 2.5l-3 3.1c-.8-.7-1.9-1.1-3.1-1.1z" fill="#4285F4"/>
    <path d="M12.5 18.6c-2.8 0-5.2-1.3-6.8-3.2l4.3-3.4c.8 2 2.8 3.4 5.2 3.4 1.5 0 2.7-.5 3.5-1.3l3 3c-1.8 1.9-4.3 3.1-7.2 3.1z" fill="#34A853"/>
    <path d="M21.8 9.1c0-.5 0-1-.1-1.5H12.5v3h3.5c-.2.9-.8 1.6-1.5 2.1l3 3c1.8-1.7 2.8-4.1 2.8-6.6z" fill="#FBBC05"/>
    <text x="25" y="13" fill="#5F6368" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="bold">Pay</text>
  </svg>
);

// PhonePe SVG logo
const PhonePeLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#5F259F"/>
    <path d="M11 6h4v1.5h-4v.8h4v1.5h-4v2.5c0 .6.4 1 1 1h3v1.5h-3.5c-1.4 0-2.5-1.1-2.5-2.5v-2.5h-2V9.8h2v-.8h-2V7.5h2V6z" fill="white"/>
    <text x="28" y="16.5" fill="#5F259F" fontFamily="system-ui, -apple-system, sans-serif" fontSize="13" fontWeight="bold">PhonePe</text>
  </svg>
);

// Paytm SVG logo
const PaytmLogo = () => (
  <svg className="h-5.5 w-auto" viewBox="0 0 65 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="15.5" fill="#002970" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="900" letterSpacing="-0.5px">Pay</text>
    <text x="26" y="15.5" fill="#00BAF2" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="900" letterSpacing="-0.5px">tm</text>
  </svg>
);

// BHIM UPI SVG logo
const BhimLogo = () => (
  <svg className="h-5.5 w-auto" viewBox="0 0 70 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="15.5" fill="#F47D20" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="900" letterSpacing="-0.5px">BH</text>
    <text x="20" y="15.5" fill="#097939" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="900" letterSpacing="-0.5px">IM</text>
    <rect x="39" y="3" width="1.5" height="14" fill="#E5E7EB"/>
    <path d="M46 6.5h1.8L46.3 11h-1.8L46 6.5z" fill="#00824A" />
    <text x="49" y="14" fill="#00824A" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="900" letterSpacing="0.2px">UPI</text>
  </svg>
);

function CheckoutContent() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const { items, getCartSubtotal, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();

  const [mounted, setMounted] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  // Custom Address form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Credit Card Form
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // UPI / QR Code Payment Form
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');
  const [upiTxnId, setUpiTxnId] = useState('');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'qr'>('gpay');
  const [upiId, setUpiId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.info('Please log in to continue checkout.');
        router.push('/login?redirect=/checkout');
      } else if (items.length === 0) {
        toast.info('Your bag is empty.');
        router.push('/cart');
      } else if (user && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setSelectedAddressId(defaultAddr._id || '');
      } else {
        setShowNewAddressForm(true);
      }
    }
  }, [mounted, isAuthenticated, items, user, router]);

  if (!mounted || !isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading checkout flow...
        </div>
      </div>
    );
  }

  const subtotal = getCartSubtotal();
  const shippingFee = subtotal >= 5000 ? 0 : 150;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = Number((subtotal + shippingFee + estimatedTax).toFixed(2));

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode || !country) {
      toast.error('Please enter all address details.');
      return;
    }

    try {
      const res = await axiosInstance.post('/users/addresses', {
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: user?.addresses.length === 0
      });

      if (res.data.success) {
        toast.success('Address added to address book.');
        // Refresh user in auth store
        const profileRes = await axiosInstance.get('/users/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
          const newAddresses = profileRes.data.user.addresses;
          const addedAddr = newAddresses[newAddresses.length - 1];
          setSelectedAddressId(addedAddr._id || '');
        }
        setShowNewAddressForm(false);
        setStreet('');
        setCity('');
        setState('');
        setPostalCode('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate checkout payload
    let finalAddress = null;
    if (selectedAddressId) {
      finalAddress = user?.addresses.find((a) => a._id === selectedAddressId);
    }

    if (!finalAddress) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        toast.error('Stripe has not loaded yet. Please try again.');
        return;
      }
      if (!cardName) {
        toast.error('Please enter cardholder name.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (upiProvider === 'qr') {
        if (!upiTxnId || upiTxnId.trim().length < 8) {
          toast.error('Please enter a valid UPI Transaction Ref No.');
          return;
        }
      } else {
        if (!upiId || !upiId.includes('@')) {
          toast.error('Please enter a valid UPI ID (e.g. name@upi).');
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      // Create order
      const orderPayload = {
        shippingAddress: {
          street: finalAddress.street,
          city: finalAddress.city,
          state: finalAddress.state,
          postalCode: finalAddress.postalCode,
          country: finalAddress.country
        },
        shippingMethod: shippingFee === 0 ? 'Free Shipping' : 'Standard Shipping',
        paymentMethod: paymentMethod,
        transactionId: paymentMethod === 'upi' 
          ? (upiProvider === 'qr' ? upiTxnId : `upi_${upiProvider}_${upiId.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(2, 8)}`)
          : (paymentMethod === 'cod' ? `cod_${Math.random().toString(36).substring(2, 10)}` : undefined),
        totalPrice: orderTotal,
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity
        }))
      };

      const res = await axiosInstance.post('/orders', orderPayload);
      
      if (res.data.success) {
        const { order, clientSecret } = res.data;

        if (paymentMethod === 'upi') {
          toast.success('Order placed successfully! Awaiting UPI payment verification.');
          clearCart();
          router.push(`/orders/${order._id}`);
          return;
        }

        if (paymentMethod === 'cod') {
          toast.success('Order placed successfully via Cash on Delivery!');
          clearCart();
          router.push(`/orders/${order._id}`);
          return;
        }

        // If Stripe clientSecret has mock prefix, or is not set, simulate payment success
        if (!clientSecret || clientSecret.startsWith('mock_secret')) {
          // Trigger simulated webhook/payment confirmation endpoint
          const confirmRes = await axiosInstance.post('/orders/confirm-payment', {
            transactionId: order.transactionId
          });

          if (confirmRes.data.success) {
            toast.success('Simulated Payment Successful! Order created.');
            clearCart();
            router.push(`/orders/${order._id}`);
          }
        } else {
          // Real Stripe Payment confirmation!
          if (!stripe || !elements) {
            toast.error('Stripe has not initialized yet.');
            setSubmitting(false);
            return;
          }
          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            toast.error('Card field not found.');
            setSubmitting(false);
            return;
          }

          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: cardName || user?.name || 'Customer',
                email: user?.email || '',
              },
            },
          });

          if (result.error) {
            toast.error(result.error.message || 'Payment failed.');
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // Confirm payment on backend
              const confirmRes = await axiosInstance.post('/orders/confirm-payment', {
                transactionId: result.paymentIntent.id
              });

              if (confirmRes.data.success) {
                toast.success('Payment Successful! Order placed.');
                clearCart();
                router.push(`/orders/${order._id}`);
              }
            }
          }
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed. Please review details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-outline-variant pb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Address Selection & Card Form */}
        <div className="lg:col-span-8 space-y-10">
          {/* Shipping Address Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              1. Shipping Address
            </h3>

            {user && user.addresses.length > 0 && (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-4 p-4 border border-outline-variant cursor-pointer transition-all ${
                      selectedAddressId === addr._id ? 'bg-surface-dim border-primary' : 'hover:bg-surface-dim'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      className="mt-1"
                      checked={selectedAddressId === addr._id}
                      onChange={() => {
                        setSelectedAddressId(addr._id || '');
                        setShowNewAddressForm(false);
                      }}
                    />
                    <div className="text-xs font-semibold uppercase tracking-wider text-outline-variant leading-relaxed">
                      <div className="font-bold text-primary">{user.name}</div>
                      <div>{addr.street}</div>
                      <div>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </div>
                      <div>{addr.country}</div>
                      {addr.isDefault && (
                        <span className="inline-block mt-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!showNewAddressForm ? (
              <button
                onClick={() => {
                  setSelectedAddressId('');
                  setShowNewAddressForm(true);
                }}
                className="text-xs font-bold uppercase text-accent hover:underline flex items-center gap-1 mt-2 focus:outline-none"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Ship to a new address
              </button>
            ) : (
              <form onSubmit={handleAddNewAddress} className="border border-outline-variant p-6 space-y-4 mt-4 bg-surface-dim">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">New Shipping Address</h4>

                <div className="space-y-1">
                  <label htmlFor="street" className="block text-[10px] font-bold uppercase tracking-widest">
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    required
                    className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                    placeholder="123 Main St"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="city" className="block text-[10px] font-bold uppercase tracking-widest">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="state" className="block text-[10px] font-bold uppercase tracking-widest">
                      State / Region
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                      placeholder="NY"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
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
                      required
                      className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="country" className="block text-[10px] font-bold uppercase tracking-widest">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      className="w-full border border-outline-variant bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all rounded-none"
                  >
                    Save Address
                  </button>
                  {user && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAddressForm(false);
                        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
                        setSelectedAddressId(defaultAddr._id || '');
                      }}
                      className="border border-outline-variant text-outline hover:text-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Payment Card Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              2. Payment Details
            </h3>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="flex flex-col md:flex-row border border-outline-variant rounded-none min-h-[380px] max-w-2xl bg-white">
                {/* Left Side Pane: Vertical Navigation tabs (Myntra/Ajio style) */}
                <div className="w-full md:w-[240px] shrink-0 bg-[#fafafa] border-b md:border-b-0 md:border-r border-outline-variant flex flex-row md:flex-col">
                  {[
                    { id: 'upi', name: 'UPI (GPay/PhonePe)', icon: 'payments' },
                    { id: 'card', name: 'Credit / Debit Card', icon: 'credit_card' },
                    { id: 'cod', name: 'Cash on Delivery', icon: 'local_shipping' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id as any)}
                      className={`flex-1 md:flex-none flex items-center justify-between px-5 py-5 text-[10px] font-bold uppercase tracking-wider text-left transition-all border-b md:border-b-0 border-outline-variant/40 ${
                        paymentMethod === tab.id 
                          ? 'bg-white border-l-4 border-l-primary text-primary font-black border-b-2 border-b-primary md:border-b-0' 
                          : 'text-outline border-l-4 border-l-transparent hover:bg-surface-dim'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                          {tab.icon}
                        </span>
                        <span>{tab.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Side Pane: Active payment input forms */}
                <div className="flex-1 p-6 bg-white flex flex-col justify-between min-h-[300px]">
                  {paymentMethod === 'card' && (
                    <div className="border border-outline-variant bg-[#fbfbfb] p-6 space-y-4 shadow-editorial relative rounded-none">
                      <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                        <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-green-600">lock</span>
                          Secure Card Details
                        </span>
                        <div className="flex items-center gap-2 opacity-90">
                          <svg className="h-2.5 w-auto" viewBox="0 0 36 12" fill="#1A1F71">
                            <path d="M13.82 0L10.82 12H8.38L5.78 2.68C5.66 2.2 5.56 1.8 5.06 1.5C4.54 1.2 3.52 0.88 2.48 0.66L2.58 0.16H6.62C7.26 0.16 7.82 0.58 7.96 1.24L9.12 7.5L11.58 0H13.82ZM20.88 8.16C20.9 5.6 17.5 5.48 17.52 3.92C17.54 3.44 17.98 2.94 18.96 2.82C19.44 2.76 20.76 2.7 22.36 3.46L22.78 1.4C21.9 1.08 20.78 0.76 19.38 0.76C17.02 0.76 15.34 2.06 15.32 4.62C15.3 7.5 18.72 7.64 18.7 9.24C18.68 9.72 18.2 10.2 17.14 10.32C16.5 10.4 15.22 10.3 13.58 9.54L13.16 11.66C14.16 12.06 15.42 12.4 16.92 12.4C19.38 12.4 20.86 11.1 20.88 8.16ZM26.96 0L25.04 12H22.72L24.64 0H26.96ZM34.2 0.16L30.98 8.2L29.6 1.2C29.44 0.54 28.92 0.16 28.3 0.16H24.58L24.5 0.52C25.32 0.72 26.54 1.1 27.52 1.62C28.12 1.94 28.28 2.18 28.46 2.88L30.96 12H33.42L36 0.16H34.2Z"/>
                          </svg>
                          <svg className="h-3.5 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                            <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.8"/>
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cardName" className="block text-[9px] font-bold uppercase tracking-widest text-outline">
                          Cardholder Name
                        </label>
                        <input
                          id="cardName"
                          type="text"
                          required
                          className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary"
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-outline">
                          Card Information
                        </label>
                        <div className="border border-outline-variant p-3.5 bg-white shadow-sm">
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: '13px',
                                  color: '#1C1B1B',
                                  fontFamily: 'system-ui, sans-serif',
                                  '::placeholder': {
                                    color: '#a1a1aa',
                                  },
                                },
                                invalid: {
                                  color: '#dc2626',
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* PCI DSS Compliance note */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/60 text-[9px] text-outline font-semibold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px] text-green-600">security</span>
                        <span>PCI-DSS Compliant 256-bit SSL Encryption</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-6">
                      {/* UPI Provider Selection Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                        {[
                          { id: 'gpay', logo: <GooglePayLogo /> },
                          { id: 'phonepe', logo: <PhonePeLogo /> },
                          { id: 'paytm', logo: <PaytmLogo /> },
                          { id: 'bhim', logo: <BhimLogo /> },
                          { id: 'qr', logo: <span className="flex items-center gap-1 font-bold text-[9px] text-primary"><span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>Scan QR</span> }
                        ].map((prov) => (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => setUpiProvider(prov.id as any)}
                            className={`flex flex-col items-center justify-center py-4 px-2 border text-center transition-all gap-1.5 rounded-none min-h-[52px] ${
                              upiProvider === prov.id 
                                ? 'border-primary bg-primary/[0.03] ring-1 ring-primary' 
                                : 'border-outline-variant bg-white text-primary hover:bg-surface-dim'
                            }`}
                          >
                            {prov.logo}
                          </button>
                        ))}
                      </div>

                      {upiProvider !== 'qr' ? (
                        <div className="border border-outline-variant bg-[#fbfbfb] p-6 space-y-4 shadow-editorial relative rounded-none w-full">
                          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-[#635bff]">payments</span>
                              Pay via UPI ID
                            </span>
                            <span className="text-[9px] font-bold tracking-widest text-outline bg-surface-dim px-2 py-0.5 border border-outline-variant uppercase">
                              {upiProvider === 'gpay' && 'Google Pay'}
                              {upiProvider === 'phonepe' && 'PhonePe'}
                              {upiProvider === 'paytm' && 'Paytm'}
                              {upiProvider === 'bhim' && 'BHIM UPI'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <label htmlFor="upiId" className="block text-[9px] font-bold uppercase tracking-widest text-outline">
                                Enter your UPI ID
                              </label>
                              <span className="text-[8px] text-accent font-bold uppercase">Required</span>
                            </div>
                            <input
                              id="upiId"
                              type="text"
                              required
                              className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary font-mono"
                              placeholder={
                                upiProvider === 'gpay' ? 'username@okaxis' :
                                upiProvider === 'phonepe' ? 'username@yapl' :
                                upiProvider === 'paytm' ? 'username@paytm' : 'username@upi'
                              }
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value.trim())}
                            />
                            <p className="text-[8px] text-outline uppercase tracking-wider pt-1.5 leading-relaxed">
                              A payment request will be sent to your {upiProvider === 'gpay' ? 'Google Pay' : upiProvider === 'phonepe' ? 'PhonePe' : upiProvider === 'paytm' ? 'Paytm' : 'BHIM'} app after placing the order.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* PhonePe QR Scanner Card */}
                          <div className="border border-outline-variant bg-[#0c0c0c] p-6 text-center space-y-4 shadow-editorial relative rounded-none w-full">
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                              <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Scan to Pay</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5f259f] bg-[#5f259f]/10 px-2 py-0.5 border border-[#5f259f]/20">PhonePe QR</span>
                            </div>

                            {/* Perfectly Cropped QR Scanner */}
                            <div className="w-56 h-56 overflow-hidden border border-zinc-800 bg-black mx-auto relative rounded-none shadow-inner">
                              <img
                                src="/phonepe-qr.png"
                                alt="PhonePe UPI QR Scanner"
                                className="w-full h-full object-cover object-center scale-[1.35] translate-y-[-1%]"
                              />
                            </div>

                            <div className="space-y-1 pt-2">
                              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">UPI ID</p>
                              <div className="flex items-center justify-center gap-2">
                                <code className="text-xs font-mono font-bold text-white bg-zinc-900 px-3 py-1.5 border border-zinc-800 tracking-wider">
                                  9110300509@axl
                                </code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText('9110300509@axl');
                                    toast.success('UPI ID copied to clipboard!');
                                  }}
                                  className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white p-1.5 text-xs flex items-center justify-center rounded-none"
                                  title="Copy UPI ID"
                                >
                                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest pt-2 leading-relaxed">
                              Please scan the QR code above or pay directly to the UPI ID, then enter the 12-digit transaction reference number below.
                            </p>
                          </div>

                          {/* Transaction ID input */}
                          <div className="space-y-1 w-full">
                            <div className="flex justify-between items-baseline">
                              <label htmlFor="upiTxnId" className="block text-[10px] font-bold uppercase tracking-widest">
                                UPI Transaction Ref No. (12 Digits)
                              </label>
                              <span className="text-[9px] text-accent font-bold uppercase">Required</span>
                            </div>
                            <input
                              id="upiTxnId"
                              type="text"
                              required
                              maxLength={12}
                              className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary font-mono tracking-widest"
                              placeholder="e.g. 123456789012"
                              value={upiTxnId}
                              onChange={(e) => setUpiTxnId(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="border border-outline-variant bg-[#fbfbfb] p-6 space-y-4 shadow-editorial relative rounded-none w-full">
                      <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                        <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-green-600">local_shipping</span>
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[9px] font-bold tracking-widest text-green-600 bg-green-50 px-2 py-0.5 border border-green-200 uppercase">
                          Available
                        </span>
                      </div>

                      <div className="space-y-2 text-xs leading-relaxed text-outline font-medium">
                        <p>You can pay via Cash, UPI, or Card at the time of delivery.</p>
                        <p className="text-[9px] font-bold text-accent uppercase tracking-wider">
                          * Please ensure someone is available at the address to receive the shipment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 max-w-2xl">
                <button
                  type="submit"
                  disabled={submitting || showNewAddressForm}
                  className="w-full bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none text-center"
                >
                  {submitting ? 'Processing Order...' : `Place Order • ₹${orderTotal}`}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Checkout Summary */}
        <div className="lg:col-span-4 border border-outline-variant p-6 shadow-editorial bg-white">
          <h3 className="text-md font-bold uppercase tracking-widest mb-6 border-b border-outline-variant pb-3">
            In your bag
          </h3>

          <div className="space-y-4 mb-8 divide-y divide-outline-variant max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => {
              const activePrice = item.product.discountPrice || item.product.price;
              return (
                <div key={item.product._id} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 aspect-[3/4] bg-surface-dim shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-xs font-semibold text-primary truncate max-w-[150px]">
                      <div>{item.product.name}</div>
                      <div className="text-outline">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold">₹{activePrice * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 text-[10px] font-bold text-outline uppercase tracking-wider border-t border-outline-variant pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-primary">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="text-primary">₹{estimatedTax}</span>
            </div>
            <div className="border-t border-outline-variant pt-3 mt-3 flex justify-between text-xs font-bold text-primary">
              <span>Total Price</span>
              <span>₹{orderTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPageContent() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}

const CheckoutPage = dynamic(
  () => Promise.resolve(CheckoutPageContent),
  { ssr: false }
);

export default CheckoutPage;
