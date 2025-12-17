import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  size?: string;
  color?: string;
  material?: string;
  stockQuantity: number | string;
  imageUrl?: string;
  categoryId?: string | number;
  Category?: Category;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    size: string;
    color: string;
    material: string;
    stockQuantity: string;
    imageUrl: string;
    categoryId: string;
  }>({
    name: '',
    description: '',
    price: '',
    size: '',
    color: '',
    material: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/admin/products/${editingProduct.id}`, formData);
      } else {
        await axios.post('/admin/products', formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId ? String(product.categoryId) : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      size: '',
      color: '',
      material: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.Category?.name || '-'}</td>
                <td className="px-6 py-4">
                  ₦{parseFloat(String(product.price)).toLocaleString()}
                </td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-4 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;