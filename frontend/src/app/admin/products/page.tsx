'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminProductManagementPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/products?search=${search}&page=${page}&limit=10`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      toast.error('Failed to load products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await axiosInstance.delete(`/products/${productId}`);
      if (res.data.success) {
        toast.success(`Product "${name}" deleted successfully.`);
        fetchProducts(); // Refresh list
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="space-y-12 bg-white border border-outline-variant p-6 md:p-8 shadow-editorial">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Product Inventory</h1>
          <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
            Create, update, and manage catalog items
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-none text-center"
        >
          Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md bg-surface-dim p-2">
        <input
          type="text"
          placeholder="Search by product name..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-2 py-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-none hover:opacity-90"
        >
          Search
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading catalog items...
        </div>
      ) : products.length === 0 ? (
        <p className="text-center py-12 text-xs text-outline font-semibold uppercase tracking-widest bg-surface-dim">
          No products matched search query.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-2">
                <th className="py-2">Image</th>
                <th className="py-2">Product Name</th>
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Stock</th>
                <th className="py-2 text-right">Rating</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.map((p) => {
                const categoryName = typeof p.category === 'object' ? p.category.name : 'Tech';
                return (
                  <tr key={p._id} className="hover:bg-surface-dim transition-colors">
                    {/* Image */}
                    <td className="py-3 pr-4">
                      <div className="w-10 aspect-[3/4] bg-surface-dim overflow-hidden">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 font-semibold text-primary max-w-[200px] truncate">
                      {p.name}
                    </td>

                    {/* Category */}
                    <td className="py-3 text-outline font-semibold uppercase tracking-wider">
                      {categoryName}
                    </td>

                    {/* Price */}
                    <td className="py-3 text-right font-bold text-primary">
                      ₹{p.discountPrice || p.price}
                    </td>

                    {/* Stock */}
                    <td className={`py-3 text-right font-bold ${p.stock <= 5 ? 'text-red-600' : 'text-primary'}`}>
                      {p.stock} units
                    </td>

                    {/* Rating */}
                    <td className="py-3 text-right text-outline font-semibold">
                      {p.rating} / 5 ({p.reviewsCount})
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-center">
                      <div className="flex gap-3 justify-center items-center">
                        <Link
                          href={`/admin/products/edit/${p._id}`}
                          className="text-xs font-bold uppercase text-accent hover:underline flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="text-xs font-bold uppercase text-red-600 hover:underline flex items-center gap-0.5 focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-outline-variant pt-6 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border border-outline-variant disabled:opacity-50 px-3 py-1.5 hover:bg-surface-dim transition-colors text-xs font-bold uppercase"
          >
            Previous
          </button>
          <span className="text-xs font-bold uppercase tracking-wider">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border border-outline-variant disabled:opacity-50 px-3 py-1.5 hover:bg-surface-dim transition-colors text-xs font-bold uppercase"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
