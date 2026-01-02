// src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Package, Truck, Shield } from 'lucide-react';

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<Product>(`/products/${id}`);
      setProduct(response.data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      setAddingToCart(true);
      addToCart(product, quantity);
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(false);
      }, 1000);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ? 'There was an error loading this product.' : 'The product you\'re looking for doesn\'t exist.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/shop')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Shop
            </button>
            {error && (
              <button
                onClick={fetchProduct}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/shop')}
        className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          {/* Category Badge */}
          {product.Category && (
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                {product.Category.name}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-purple-600">
                GH₵ {parseFloat(String(product.price)).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {isOutOfStock ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">Out of Stock</p>
                <p className="text-sm">This item is currently unavailable</p>
              </div>
            ) : isLowStock ? (
              <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 px-4 py-3 rounded">
                <p className="font-semibold">Only {product.stockQuantity} left in stock!</p>
                <p className="text-sm">Order soon before it's gone</p>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                <p className="font-semibold">In Stock ({product.stockQuantity} available)</p>
                <p className="text-sm">Ready to ship</p>
              </div>
            )}
          </div>

          {/* Product Specifications */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-800">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-semibold text-gray-800">{product.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-semibold text-gray-800">{product.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Material</p>
                <p className="font-semibold text-gray-800">{product.material}</p>
              </div>
              <div>
                {/* <p className="text-sm text-gray-600">Product ID</p>
                <p className="font-semibold text-gray-800 text-sm">#{product.id.slice(0, 8)}</p> */}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-lg border-x-2 border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockQuantity}
                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {product.stockQuantity}
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : addingToCart
                ? 'bg-green-600 text-white'
                : 'bg-green-700 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {addingToCart ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Added to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={20} />
                <span>Add to Cart - GH₵{(parseFloat(String(product.price)) * quantity).toLocaleString()}</span>
              </>
            )}
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <Package className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Quality Guaranteed</p>
                <p className="text-sm text-gray-600">Premium materials and craftsmanship</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Fast Delivery</p>
                <p className="text-sm text-gray-600">Delivered within 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Secure Payment</p>
                <p className="text-sm text-gray-600">Your payment information is safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;