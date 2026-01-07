import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Plus, Edit, Trash2, Save, X, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

interface Product {
  id: string;
  name: string;
  price: number | string; // Backend might return string
  categoryId: string;
  stock: number;
  sizes: string[] | null; // Can be null from backend
  description?: string;
  imageUrl?: string;
  Category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    stock: '',
    sizes: [] as string[],
    description: '',
    imageUrl: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from:', `${API_URL}/api/products`);

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Products response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          setError('Admin access required');
          navigate('/');
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to load products');
      }

      const data = await response.json();
      console.log('Products data:', data);
      
      // Transform products to ensure sizes is always an array
      const transformedProducts = data.map((product: any) => {
        let sizes = product.sizes;
        
        // Handle if sizes is a JSON string
        if (typeof sizes === 'string') {
          try {
            sizes = JSON.parse(sizes);
          } catch (e) {
            sizes = [];
          }
        }
        
        // Ensure sizes is an array
        if (!Array.isArray(sizes)) {
          sizes = [];
        }
        
        return {
          ...product,
          sizes
        };
      });
      
      console.log('Transformed products:', transformedProducts);
      setProducts(transformedProducts);
      setError('');
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', `${API_URL}/api/categories`);

      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      console.log('Categories data:', data);
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: String(product.price), // Ensure it's a string for the input
        categoryId: product.categoryId,
        stock: String(product.stock), // Ensure it's a string for the input
        sizes: product.sizes || [],
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        categoryId: categories[0]?.id || '',
        stock: '',
        sizes: [],
        description: '',
        imageUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      categoryId: '',
      stock: '',
      sizes: [],
      description: '',
      imageUrl: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.sizes.length === 0) {
      alert('Please select at least one size');
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        description: formData.description,
        imageUrl: formData.imageUrl || null
      };

      console.log('Submitting product data:', productData);

      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to save product');
      }

      const savedProduct = await response.json();
      console.log('Product saved:', savedProduct);

      if (editingProduct) {
        setProducts(prev =>
          prev.map(p => p.id === editingProduct.id ? savedProduct : p)
        );
      } else {
        setProducts(prev => [savedProduct, ...prev]);
      }

      handleCloseModal();
      alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      console.error('Error saving product:', err);
      alert(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('Deleting product:', id);

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Failed to delete product');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold serif mb-2 text-gray-700">Manage Products</h1>
            <p className="text-xl text-gray-600">Add, edit, or remove ready-made products</p>
            <p className="text-sm text-gray-500 mt-2">Total Products: {products.length}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No products found</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-100">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Product Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Sizes</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <span className="font-semibold text-gray-700">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold capitalize">
                          {product.Category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-700">GH₵ {parseFloat(String(product.price)).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10 ? 'bg-green-100 text-green-600' :
                          product.stock > 5 ? 'bg-yellow-100 text-yellow-600' :
                          product.stock === 0 ? 'bg-red-100 text-red-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{(product.sizes || []).join(', ') || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold serif text-gray-700">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Price (GH₵) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100 capitalize"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="capitalize">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Available Sizes *</label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        disabled={submitting}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                          formData.sizes.includes(size)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {formData.sizes.length === 0 && (
                    <p className="text-sm text-red-600 mt-2">Please select at least one size</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                    placeholder="Product description..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;