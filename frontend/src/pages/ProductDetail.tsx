// src/pages/ProductDetail.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../App';

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
  Category?: {
    name: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/shop')}
        className="mb-6 text-purple-600 hover:text-purple-800 flex items-center"
      >
        ← Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-2 text-sm text-gray-600">
            {product.Category?.name}
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold text-purple-600 mb-6">
            ₦{parseFloat(String(product.price)).toLocaleString()}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex">
              <span className="font-semibold w-24">Size:</span>
              <span>{product.size}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Color:</span>
              <span>{product.color}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Material:</span>
              <span>{product.material}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Stock:</span>
              <span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description:</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.stockQuantity > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 font-semibold text-lg"
              >
                Add to Cart
              </button>
            </div>
          )}

          {product.stockQuantity === 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              This product is currently out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;