'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IProduct, IReview } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import ProductCard from '@/components/ProductCard';
import { toast } from 'react-toastify';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        // Fetch Product Details
        const prodRes = await axiosInstance.get(`/products/${id}`);
        if (prodRes.data.success) {
          const prod = prodRes.data.product;
          setProduct(prod);

          // Fetch Related Products (same category)
          const catId = typeof prod.category === 'object' ? prod.category.slug : prod.category;
          const relatedRes = await axiosInstance.get(`/products?category=${catId}&limit=5`);
          if (relatedRes.data.success) {
            // Exclude current product
            const filtered = relatedRes.data.products.filter(
              (p: IProduct) => p._id !== prod._id
            );
            setRelatedProducts(filtered.slice(0, 4));
          }
        }

        // Fetch Product Reviews
        const reviewsRes = await axiosInstance.get(`/reviews/product/${id}`);
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white text-primary">
        <span className="material-symbols-outlined text-4xl mb-4">inventory</span>
        <h2 className="text-xl font-bold uppercase tracking-tighter">Product Not Found</h2>
        <button
          onClick={() => router.push('/products')}
          className="mt-6 border border-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-none"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const activePrice = product.discountPrice || product.price;

  const handleAddToCart = async () => {
    await addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = async () => {
    if (isFavorite) {
      await removeFromWishlist(product._id);
      toast.info('Removed from wishlist.');
    } else {
      await addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axiosInstance.post(`/reviews/product/${product._id}`, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        toast.success('Review posted successfully!');
        // Refresh reviews list
        const reviewsRes = await axiosInstance.get(`/reviews/product/${product._id}`);
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
        }
        
        // Refresh product details for new rating average
        const prodRes = await axiosInstance.get(`/products/${product._id}`);
        if (prodRes.data.success) {
          setProduct(prodRes.data.product);
        }

        setReviewComment('');
        setReviewRating(5);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[16px] text-outline-variant">
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      {/* Product Detail Top Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
        {/* Left Column: Image Gallery */}
        <div className="bg-surface-dim aspect-[3/4] w-full overflow-hidden relative">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {product.stock <= 0 && (
            <span className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
              Out of stock
            </span>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="flex flex-col justify-start">
          <span className="text-xs font-bold uppercase tracking-widest text-outline mb-2">
            {typeof product.category === 'object' ? product.category.name : 'Curated Tech'}
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Ratings Summary */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs font-bold tracking-wider text-outline-variant">|</span>
            <span className="text-xs font-bold uppercase tracking-widest text-outline">
              {product.reviewsCount} {product.reviewsCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex gap-4 items-center mb-8">
            <span className="text-2xl font-black text-primary">₹{activePrice}</span>
            {product.discountPrice && (
              <span className="text-base text-outline line-through">₹{product.price}</span>
            )}
          </div>

          <p className="text-sm text-outline leading-relaxed mb-8 max-w-lg">
            {product.description}
          </p>

          <div className="border-t border-b border-outline-variant py-6 mb-8 flex flex-col sm:flex-row gap-6 items-center">
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center border border-outline-variant">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-surface-dim transition-colors text-sm font-semibold"
                >
                  -
                </button>
                <span className="px-6 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-surface-dim transition-colors text-sm font-semibold"
                >
                  +
                </button>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4 w-full sm:flex-1">
              <button
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className="flex-1 bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-none"
              >
                {product.stock <= 0 ? 'Out of stock' : 'Add to Bag'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className="border border-outline-variant text-primary p-4 hover:bg-surface-dim transition-colors active:scale-95 rounded-none flex items-center justify-center"
              >
                <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'text-red-600 font-variation-fill-1' : ''}`} style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  favorite
                </span>
              </button>
            </div>
          </div>

          {/* Specs / Stock count */}
          <div className="space-y-2 text-xs font-semibold text-outline uppercase tracking-wider">
            <div>Availability: <span className="text-primary font-bold">{product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of stock'}</span></div>
            <div>Subcategory: <span className="text-primary font-bold">{product.subcategory || 'General'}</span></div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="border-t border-outline-variant pt-16 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Reviews List */}
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tighter">Reviews ({reviews.length})</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6 divide-y divide-outline-variant">
              {reviews.map((review) => (
                <div key={review._id} className="pt-6 first:pt-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {review.user?.name || 'Verified Customer'}
                    </div>
                    <div className="text-[10px] text-outline font-semibold">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex mb-3">{renderStars(review.rating)}</div>
                  <p className="text-sm text-outline leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-dim p-8 text-center text-xs text-outline font-semibold uppercase tracking-widest">
              No reviews have been written for this product yet.
            </div>
          )}
        </div>

        {/* Right Column: Write a Review */}
        <div className="lg:col-span-5 border border-outline-variant p-8 shadow-editorial self-start bg-white">
          <h3 className="text-md font-bold uppercase tracking-widest mb-6">Write a Review</h3>

          {isAuthenticated ? (
            <form onSubmit={handlePostReview} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-primary hover:scale-110 transition-transform focus:outline-none"
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{
                          fontVariationSettings: star <= reviewRating ? "'FILL' 1" : "'FILL' 0"
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-widest">
                  Review Comment
                </label>
                <textarea
                  id="comment"
                  required
                  rows={4}
                  className="w-full border border-outline-variant p-3 text-sm focus:outline-none focus:border-primary rounded-none"
                  placeholder="Share your experience with this tech..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-primary disabled:bg-outline text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="text-center p-6 bg-surface-dim">
              <p className="text-xs text-outline font-semibold uppercase tracking-wider mb-4">
                Please sign in to write a review.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="bg-primary text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all rounded-none"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-outline-variant pt-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-primary">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
