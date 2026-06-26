'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICategory } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get('/products/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
          if (res.data.categories.length > 0) {
            setCategoryId(res.data.categories[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !categoryId || stock === '') {
      toast.error('Please enter all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        category: categoryId,
        subcategory,
        stock: Number(stock),
        images: imageUrl ? [imageUrl] : undefined
      };

      const res = await axiosInstance.post('/products', payload);
      if (res.data.success) {
        toast.success(`Product "${name}" created successfully.`);
        router.push('/admin/products');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-outline-variant p-6 md:p-8 shadow-editorial text-primary">
      <div className="mb-8 pb-4 border-b border-outline-variant">
        <Link
          href="/admin/products"
          className="text-xs font-bold uppercase text-outline hover:text-primary transition-colors flex items-center gap-1 mb-2"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Inventory
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Add New Product</h1>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
          Define inventory specs, pricing details, and category listings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
            placeholder="Flagship Monitor 32"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="desc" className="block text-xs font-bold uppercase tracking-widest">
            Description *
          </label>
          <textarea
            id="desc"
            required
            rows={4}
            className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
            placeholder="Enter full technical summary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="price" className="block text-xs font-bold uppercase tracking-widest">
              Standard Price (₹) *
            </label>
            <input
              id="price"
              type="number"
              required
              min={0}
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
              placeholder="799"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="discount" className="block text-xs font-bold uppercase tracking-widest">
              Discount Price (₹)
            </label>
            <input
              id="discount"
              type="number"
              min={0}
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
              placeholder="699"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="category" className="block text-xs font-bold uppercase tracking-widest">
              Category *
            </label>
            <select
              id="category"
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none bg-white"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="subcat" className="block text-xs font-bold uppercase tracking-widest">
              Subcategory
            </label>
            <input
              id="subcat"
              type="text"
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
              placeholder="Screens"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="stock" className="block text-xs font-bold uppercase tracking-widest">
              Stock Units *
            </label>
            <input
              id="stock"
              type="number"
              required
              min={0}
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
              placeholder="25"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="image" className="block text-xs font-bold uppercase tracking-widest">
              Image URL (Optional)
            </label>
            <input
              id="image"
              type="text"
              className="w-full border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary rounded-none"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary disabled:bg-outline text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all rounded-none"
        >
          {loading ? 'Adding Product...' : 'Add Product to Catalog'}
        </button>
      </form>
    </div>
  );
}
