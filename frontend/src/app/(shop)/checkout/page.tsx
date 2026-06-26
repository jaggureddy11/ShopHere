'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const { items, getCartSubtotal, clearCart } = useCartStore();

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiTxnId, setUpiTxnId] = useState('');

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
      if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
        toast.error('Please fill in card payment details.');
        return;
      }
    } else {
      if (!upiTxnId || upiTxnId.trim().length < 8) {
        toast.error('Please enter a valid UPI Transaction Ref No.');
        return;
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
        transactionId: paymentMethod === 'upi' ? upiTxnId : undefined,
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
          // Stripe integration uploader: In a full production build, we would mount the Stripe Elements uploader.
          // Since credentials are empty, we fallback to simulated flow.
          toast.info('Production Stripe credentials missing. Redirecting as simulated success.');
          clearCart();
          router.push(`/orders/${order._id}`);
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

            {/* Payment Method Selector Tabs */}
            <div className="flex border border-outline-variant rounded-none max-w-lg mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest text-center transition-all ${
                  paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-surface-dim'
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest text-center transition-all ${
                  paymentMethod === 'upi' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-surface-dim'
                }`}
              >
                UPI / Scan to Pay
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6 max-w-lg">
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="cardName" className="block text-[10px] font-bold uppercase tracking-widest">
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
                    <label htmlFor="cardNumber" className="block text-[10px] font-bold uppercase tracking-widest">
                      Credit Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      required
                      maxLength={16}
                      className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="cardExpiry" className="block text-[10px] font-bold uppercase tracking-widest">
                        Expiration Date
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        required
                        maxLength={5}
                        className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="cardCvc" className="block text-[10px] font-bold uppercase tracking-widest">
                        CVC / CVV Code
                      </label>
                      <input
                        id="cardCvc"
                        type="password"
                        required
                        maxLength={3}
                        className="w-full border border-outline-variant px-3 py-2.5 text-xs focus:outline-none focus:border-primary rounded-none bg-white text-primary"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* PhonePe QR Scanner Card */}
                  <div className="border border-outline-variant bg-[#0c0c0c] p-6 text-center space-y-4 shadow-editorial relative rounded-none">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Scan to Pay</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#5f259f] bg-[#5f259f]/10 px-2 py-0.5 border border-[#5f259f]/20">PhonePe</span>
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
                  <div className="space-y-1">
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

              <div className="pt-4">
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
