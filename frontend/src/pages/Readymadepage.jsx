import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Star, Filter, ShoppingBag } from 'lucide-react';
import axios from 'axios';




const ReadyMadePage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  

 

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'formal', label: 'Formal Wear' },
    { value: 'casual', label: 'Casual' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'tops', label: 'Tops & Blouses' },
    { value: 'skirts', label: 'Skirts' },
  ];

  const sizes = [
    { value: 'all', label: 'All Sizes' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize);
    return categoryMatch && sizeMatch;
  });

  const [selectedSizes, setSelectedSizes] = useState({});

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    addToCart({
      ...product,
      size,
      type: 'ready-made'
    });
    alert(`Added ${product.name} (Size: ${size}) to cart!`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold serif mb-4">Ready-Made Collection</h1>
          <p className="text-xl text-gray-600">Browse our curated selection of ready-to-wear fashion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-purple-600" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-white hover:bg-purple-50'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedSize === size.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-white hover:bg-purple-50'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-transform group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-8xl group-hover:scale-110 transition-transform">
                        {product.image}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      GH₵ {product.price}
                    </div>

                    {/* Size Selection */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">Size:</label>
                      <div className="flex gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                              (selectedSizes[product.id] || product.sizes[0]) === size
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={20} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                  }}
                  className="mt-4 text-purple-600 font-semibold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReadyMadePage;