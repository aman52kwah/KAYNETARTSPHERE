// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Ruler, Shirt, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  material: string;
  stockQuantity: number;
  imageUrl: string;
  categoryId: string;
  Category?: Category;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>('/products');
      // Get first 4 products as featured or filter by some criteria
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      setError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    { name: 'Afia Mensah', text: 'The custom-made dress exceeded my expectations! Perfect fit and beautiful fabric.', rating: 5 },
    { name: 'Kwame Osei', text: 'Professional service and quality craftsmanship. Highly recommend!', rating: 5 },
    { name: 'Ama Darko', text: 'Love the ready-made collection and the custom order process was seamless.', rating: 4 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-purple-600/90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div className="flex items-center gap-2 text-yellow-300">
              <Sparkles size={24} />
              <span className="text-sm font-semibold uppercase tracking-wider">Kaynet Artsphere Fashion Studio</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              Your Style,<br />
              <span className="text-yellow-300">Your Way</span>
            </h1>
            
            <p className="text-xl text-white/90">
              Custom-tailored elegance meets ready-to-wear convenience. Experience fashion that fits your vision perfectly.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/custom-order"
                className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Start Custom Order
              </Link>
              <Link
                to="/shop"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all"
              >
                Shop Ready Made
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-md">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ruler className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Custom Measurements</h3>
            <p className="text-gray-600">
              Personalized fitting for perfect comfort and style that complements your unique body shape.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-md">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shirt className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Premium Fabrics</h3>
            <p className="text-gray-600">
              Choose from our curated selection of high-quality materials for lasting elegance.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-md">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Craftsmanship</h3>
            <p className="text-gray-600">
              Skilled artisans bring your vision to life with attention to every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2 text-gray-800">Featured Collections</h2>
            <p className="text-gray-600">Discover our handpicked selection</p>
          </div>
          <Link
            to="/shop"
            className="text-purple-600 font-semibold hover:underline flex items-center gap-2 group"
          >
            View All 
            <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchFeaturedProducts}
              className="text-purple-600 font-semibold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 mb-4">No featured products available yet</p>
            <Link
              to="/shop"
              className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-2"
            >
              Browse All Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group transform hover:scale-105"
                style={{ 
                  animation: 'fadeInUp 0.5s ease-out',
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.Category && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {product.Category.name}
                    </div>
                  )}
                  {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Only {product.stockQuantity} left!
                    </div>
                  )}
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <span>{product.size}</span>
                    <span>•</span>
                    <span>{product.color}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">
                      GH₵ {parseFloat(String(product.price)).toLocaleString()}
                    </div>
                    {product.stockQuantity > 0 && (
                      <div className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                        In Stock
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready for Your Perfect Outfit?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you dream of a custom creation or prefer our ready-made excellence, we're here to bring your vision to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/custom-order"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Create Custom Design
            </Link>
            <Link
              to="/shop"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: `${idx * 0.1}s`,
                animationFillMode: 'backwards'
              }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-purple-600">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;