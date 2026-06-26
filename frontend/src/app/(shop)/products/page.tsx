'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IProduct, ICategory } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const search = searchParams.get('search') || '';

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get('/products/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Sync state with search params changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedSubcategory(searchParams.get('subcategory') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch Products on filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.set('category', selectedCategory);
        if (selectedSubcategory) queryParams.set('subcategory', selectedSubcategory);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (sort) queryParams.set('sort', sort);
        if (search) queryParams.set('search', search);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9'); // 9 items per page

        const res = await axiosInstance.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
          setTotalProducts(res.data.totalProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, minPrice, maxPrice, sort, page, search]);

  const updateURL = (newFilters: {
    category?: string;
    subcategory?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: number;
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newFilters.category !== undefined) {
      if (newFilters.category) {
        current.set('category', newFilters.category);
        current.delete('subcategory'); // Clear subcategory when category changes
      } else {
        current.delete('category');
        current.delete('subcategory');
      }
    }
    if (newFilters.subcategory !== undefined) {
      if (newFilters.subcategory) current.set('subcategory', newFilters.subcategory);
      else current.delete('subcategory');
    }
    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice) current.set('minPrice', newFilters.minPrice);
      else current.delete('minPrice');
    }
    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice) current.set('maxPrice', newFilters.maxPrice);
      else current.delete('maxPrice');
    }
    if (newFilters.sort !== undefined) {
      current.set('sort', newFilters.sort);
    }
    if (newFilters.page !== undefined) {
      current.set('page', newFilters.page.toString());
    } else {
      current.set('page', '1'); // reset page to 1 on filter change
    }

    router.push(`/products?${current.toString()}`);
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    router.push('/products');
  };

  return (
    <div className="max-w-[1440px] mx-auto py-12 px-6 md:px-16 text-primary bg-white">
      {/* Title */}
      <div className="mb-10 pb-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Shop Catalog</h1>
          <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
            {search ? `Search results for "${search}"` : 'All curated technical essentials'} ({totalProducts} items)
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-between md:justify-end">
          {/* Filters Toggle Button for mobile/tablet */}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white hover:bg-surface-dim transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex gap-3 items-center">
            <label htmlFor="sort" className="text-xs font-bold uppercase tracking-widest">
              Sort By:
            </label>
            <select
              id="sort"
              className="border border-outline-variant p-2 text-xs font-semibold uppercase bg-white outline-none rounded-none cursor-pointer"
              value={sort}
              onChange={(e) => updateURL({ sort: e.target.value })}
            >
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 shrink-0 space-y-8 lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => updateURL({ category: '' })}
                className={`text-left text-xs font-semibold uppercase tracking-wider py-1 hover:opacity-75 transition-opacity ${
                  selectedCategory === '' ? 'text-primary font-bold underline' : 'text-outline'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateURL({ category: cat.slug })}
                  className={`text-left text-xs font-semibold uppercase tracking-wider py-1 hover:opacity-75 transition-opacity ${
                    selectedCategory === cat.slug ? 'text-primary font-bold underline' : 'text-outline'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              Subcategory
            </h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              <button
                onClick={() => updateURL({ subcategory: '' })}
                className={`text-left text-xs font-semibold uppercase tracking-wider py-1 hover:opacity-75 transition-opacity ${
                  selectedSubcategory === '' ? 'text-primary font-bold underline' : 'text-outline'
                }`}
              >
                All Subcategories
              </button>
              {(selectedCategory === 'mens-clothing'
                ? ['T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Sweaters', 'Jackets']
                : selectedCategory === 'womens-clothing'
                ? ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Sweaters', 'Jackets']
                : selectedCategory === 'kids'
                ? ['Boys & Girls Clothing']
                : selectedCategory === 'shoes'
                ? ['Sneakers', 'Formal', 'Casual', 'Sports']
                : selectedCategory === 'accessories'
                ? ['Watches', 'Belts', 'Scarves', 'Bags', 'Caps', 'Eyewear']
                : selectedCategory === 'sportswear'
                ? ['Activewear', 'Running Gear', 'Yoga', 'Sports']
                : ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Tops', 'Sneakers', 'Formal', 'Casual', 'Bags', 'Watches', 'Activewear']
              ).map((sub) => (
                <button
                  key={sub}
                  onClick={() => updateURL({ subcategory: sub })}
                  className={`text-left text-xs font-semibold uppercase tracking-wider py-1 hover:opacity-75 transition-opacity ${
                    selectedSubcategory === sub ? 'text-primary font-bold underline' : 'text-outline'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              Price Range ($)
            </h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-full border border-outline-variant p-2 text-xs rounded-none"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => updateURL({ minPrice })}
              />
              <span className="text-outline text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full border border-outline-variant p-2 text-xs rounded-none"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => updateURL({ maxPrice })}
              />
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearAll}
            className="w-full border border-primary text-primary py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-none"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 space-y-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white p-4 h-[350px] flex flex-col justify-between">
                  <div className="bg-surface-high w-full h-[220px]" />
                  <div className="space-y-2 mt-4">
                    <div className="bg-surface-high h-3 w-1/3" />
                    <div className="bg-surface-high h-4 w-3/4" />
                    <div className="bg-surface-high h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-outline-variant pt-8 flex justify-center items-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => updateURL({ page: page - 1 })}
                    className="border border-outline-variant disabled:opacity-50 p-2 hover:bg-surface-dim transition-colors text-xs font-bold uppercase"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => updateURL({ page: page + 1 })}
                    className="border border-outline-variant disabled:opacity-50 p-2 hover:bg-surface-dim transition-colors text-xs font-bold uppercase"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="border border-outline-variant p-16 text-center bg-white shadow-editorial">
              <span className="material-symbols-outlined text-outline text-4xl mb-4">search_off</span>
              <p className="text-sm text-outline font-semibold uppercase tracking-wider">
                No products found matching your current filter settings.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-6 border border-primary text-primary px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-none"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading catalog...
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
