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

// Google Pay — accurate brand SVG (colorful G + Pay wordmark)
const GooglePayLogo = () => (
  <svg width="58" height="24" viewBox="0 0 58 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Google G icon */}
    <path d="M11.5 10.5H6v3h3.2c-.3 1.5-1.6 2.5-3.2 2.5C4.1 16 2.5 14.4 2.5 12.5S4.1 9 6 9c.9 0 1.7.3 2.3.9l2.1-2.1C9.1 6.7 7.6 6 6 6 2.7 6 0 8.7 0 12s2.7 6 6 6c3.3 0 5.8-2.3 5.8-5.7 0-.4 0-.8-.1-1.1-.1 0-.2.3-.2.2z" fill="#4285F4" />
    <path d="M11.5 10.5c0 .1.1.5.1.8v.2H6v-3h5.5z" fill="#4285F4" />
    <path d="M6 6c1.6 0 3.1.7 4.4 1.8L8.3 9.9C7.7 9.3 6.9 9 6 9 4.1 9 2.5 10.3 2.1 12L0 10.3C1.1 7.8 3.3 6 6 6z" fill="#EA4335" />
    <path d="M0 10.3l2.1 1.7C2.5 13.7 4.1 15 6 15c1.6 0 2.9-.7 3.7-1.8l2.1 1.6C10.6 16.5 8.5 18 6 18 3.3 18 1.1 16.2 0 13.7V10.3z" fill="#34A853" />
    <path d="M6 18c2.5 0 4.6-1.5 5.8-3.8L9.7 13.2C9 14.3 7.6 15 6 15v3z" fill="#34A853" />
    <path d="M11.8 11.5H6v-1h5.9c.1.3.1.7.1 1 0-.1 0 0-.2 0z" fill="#FBBC05" />
    {/* "Pay" wordmark */}
    <text x="14" y="16.5" fontFamily="'Google Sans', Arial, sans-serif" fontSize="11" fontWeight="600" fill="#3C4043">Pay</text>
  </svg>
);

// PhonePe — real icon (simple-icons SVG, white on purple square) + wordmark
const PhonePeLogo = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '22px', height: '22px', borderRadius: '5px',
      backgroundColor: '#5F259F', flexShrink: 0,
    }}>
      <img
        src="/payment-icons/phonepe.svg"
        alt="PhonePe"
        style={{ width: '16px', height: '16px', filter: 'invert(1)' }}
      />
    </span>
    <span style={{ fontWeight: 800, fontSize: '11px', color: '#5F259F', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}>
      PhonePe
    </span>
  </span>
);


// Paytm — accurate brand wordmark SVG
const PaytmLogo = () => (
  <svg width="52" height="24" viewBox="0 0 52 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="17" fontFamily="'Arial Black', Arial, sans-serif" fontSize="14" fontWeight="900" fill="#002D72" letterSpacing="-0.5">Pay</text>
    <text x="26" y="17" fontFamily="'Arial Black', Arial, sans-serif" fontSize="14" fontWeight="900" fill="#00BAF2" letterSpacing="-0.5">tm</text>
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
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
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
                    className={`flex items-start gap-4 p-4 border border-outline-variant cursor-pointer transition-all ${selectedAddressId === addr._id ? 'bg-surface-dim border-primary' : 'hover:bg-surface-dim'
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
                      className={`flex-1 md:flex-none flex items-center justify-between px-5 py-5 text-[10px] font-bold uppercase tracking-wider text-left transition-all border-b md:border-b-0 border-outline-variant/40 ${paymentMethod === tab.id
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
                          {/* Visa wordmark */}
                          <svg height="12" viewBox="0 0 52 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.3 1L14.7 16H11.3L6.7 3.8C6.5 3.2 6.3 2.9 5.8 2.6 5.1 2.2 4 1.9 2.9 1.7L3 1.2H8.4c.9 0 1.7.6 1.9 1.6l1.8 9.5L16.2 1H19.3zm13.3 10.2c0-3.7-5.1-3.9-5-5.6 0-.5.5-1 1.5-1.2.5-.1 1.8-.1 3.3.6L33 3.1C32.2 2.8 31 2.5 29.5 2.5c-3.5 0-6 1.9-6 4.6 0 2 1.8 3.1 3.1 3.8 1.4.7 1.9 1.1 1.9 1.7 0 .9-1.1 1.3-2.1 1.4-1.8 0-2.8-.5-3.6-.8l-.6 3C23 16.4 24.4 16.7 26 16.7c3.7 0 6.2-1.9 6.2-4.7zm9.2 4.8H38.7L36.5 1h3.5c.7 0 1.3.4 1.6 1l4.3 13.1-3.8.1L42.5 1l-3.5 15zm-6.5-15l-3.7 15H28.8L32.5 1h2.8z" fill="#1A1F71" />
                          </svg>
                          {/* Mastercard overlapping circles */}
                          <svg height="16" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="10" fill="#EB001B" />
                            <circle cx="20" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85" />
                            <path d="M15 5.7A10 10 0 0 1 18.3 10 10 10 0 0 1 15 14.3 10 10 0 0 1 11.7 10 10 10 0 0 1 15 5.7z" fill="#FF5F00" />
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
                          { id: 'qr', logo: <span className="flex items-center gap-1 font-bold text-[9px] text-primary"><span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>Scan QR</span> }
                        ].map((prov) => (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => setUpiProvider(prov.id as any)}
                            className={`flex flex-col items-center justify-center py-4 px-2 border text-center transition-all gap-1.5 rounded-none min-h-[52px] ${upiProvider === prov.id
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
                              A payment request will be sent to your {upiProvider === 'gpay' ? 'Google Pay' : upiProvider === 'phonepe' ? 'PhonePe' : upiProvider === 'paytm' ? 'Paytm' : 'UPI'} app after placing the order.
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
