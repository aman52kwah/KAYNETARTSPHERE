// src/pages/admin/Styles.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface Style {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  categoryId: string;
  Category?: Category;
}

interface FormData {
  name: string;
  description: string;
  basePrice: string;
  imageUrl: string;
  categoryId: string;
}

const AdminStyles: React.FC = () => {
  const [styles, setStyles] = useState<Style[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchStyles();
    fetchCategories();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await axios.get('/admin/styles');
      setStyles(response.data);
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStyle) {
        await axios.put(`/admin/styles/${editingStyle.id}`, formData);
      } else {
        await axios.post('/admin/styles', formData);
      }
      fetchStyles();
      resetForm();
      alert('Style saved successfully!');
    } catch (error) {
      console.error('Error saving style:', error);
      alert('Failed to save style');
    }
  };

  const handleEdit = (style: Style) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description || '',
      basePrice: String(style.basePrice),
      imageUrl: style.imageUrl || '',
      categoryId: style.categoryId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this style?')) {
      try {
        await axios.delete(`/admin/styles/${id}`);
        fetchStyles();
        alert('Style deleted successfully!');
      } catch (error) {
        console.error('Error deleting style:', error);
        alert('Failed to delete style');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      imageUrl: '',
      categoryId: '',
    });
    setEditingStyle(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Styles</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
        >
          + Add New Style
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Base Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {styles.map((style) => (
              <tr key={style.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={style.imageUrl || 'https://via.placeholder.com/60'}
                    alt={style.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{style.name}</td>
                <td className="px-6 py-4 text-gray-600">{style.Category?.name || '-'}</td>
                <td className="px-6 py-4 font-semibold text-purple-600">
                  ₦{parseFloat(String(style.basePrice)).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(style)}
                    className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(style.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {styles.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No styles yet. Add your first style!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingStyle ? 'Edit Style' : 'Add New Style'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">Style Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Evening Gown, Casual Dress"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <label className="block font-semibold mb-2 text-gray-700">Base Price (₦) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="5000.00"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description of the style..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold"
                >
                  {editingStyle ? 'Update Style' : 'Create Style'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStyles;