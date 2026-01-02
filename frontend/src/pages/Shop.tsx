import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "../context/CartContext";
//import { useAuth } from "../context/AuthContext";

interface Product {
  id: string | number;
  name: string;
  imageUrl?: string;
  size: string;
  color: string;
  price: number | string;
  stockQuantity: number;
  // Add other product fields as needed
}

interface Category {
  id: string | number;
  name: string;
  // Add other category fields as needed
}

// interface CartContextType {
//   addToCart: (product: Product, quantity?: number) => void;
//   // Add other fields if needed
// }

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  //const cartContext = useContext(CartContext);
  const { addToCart } = useCart();


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await axios.get<Product[]>('/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shop Ready-Made Collections</h1>
      <div className="mb-6">
        <label className="mr-4 font-semibold">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-lg mb-2 hover:text-purple-600">{product.name}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2">
                {product.size} • {product.color}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-purple-600">
                  GH₵ {parseFloat(product.price.toString()).toLocaleString()}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity === 0}
                  className={`px-4 py-2 rounded ${
                    product.stockQuantity === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-16 text-gray-500">No products found in this category.</div>
      )}
    </div>
  );
};

export default Shop;