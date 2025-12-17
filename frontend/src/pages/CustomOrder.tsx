import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Category {
  id: string | number;
  name: string;
  // Add other fields if needed
}

interface Style {
  id: string | number;
  name: string;
  description: string;
  basePrice: number | string;
  imageUrl?: string;
  // Add other fields if needed
}

interface Material {
  id: string | number;
  name: string;
  pricePerMeter: number | string;
  // Add other fields if needed
}

interface Measurements {
  chest: string;
  waist: string;
  hips: string;
  length: string;
}

interface FormData {
  categoryId: string;
  styleId: string;
  materialId: string;
  size: string;
  measurements: Measurements;
  specialInstructions: string;
}

interface CustomOrderResponse {
  id: string | number;
  // Add other fields if needed
}

interface PaymentResponse {
  authorizationUrl: string;
  // Add other fields if needed
}

const CustomOrder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    styleId: '',
    materialId: '',
    size: '',
    measurements: { chest: '', waist: '', hips: '', length: '' },
    specialInstructions: '',
  });
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchStyles(formData.categoryId);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    calculatePrice();
  }, [formData.styleId, formData.materialId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStyles = async (categoryId: string) => {
    try {
      const response = await axios.get<Style[]>(`/styles?category=${categoryId}`);
      setStyles(response.data);
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get<Material[]>('/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const calculatePrice = async () => {
    if (formData.styleId && formData.materialId) {
      const style = styles.find((s) => s.id === formData.styleId);
      const material = materials.find((m) => m.id === formData.materialId);
      if (style && material) {
        setSelectedStyle(style);
        setSelectedMaterial(material);
        const materialCost = parseFloat(material.pricePerMeter.toString()) * 2;
        const total = parseFloat(style.basePrice.toString()) + materialCost;
        setTotalPrice(total);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post<CustomOrderResponse>('/custom-orders', formData);
      const customOrder = response.data;
      // Initialize payment
      const paymentResponse = await axios.post<{ data: PaymentResponse }>('/payments/initialize-custom-order', {
        customOrderId: customOrder.id,
      });
      // Redirect to Paystack
      window.location.href = paymentResponse.data.authorizationUrl;
    } catch (error) {
      console.error('Error creating custom order:', error);
      alert('Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  const depositAmount = totalPrice * 0.5;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Custom Order</h1>
      <div className="mb-8 flex justify-between">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`flex-1 text-center ${step >= num ? 'text-purple-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                step >= num ? 'bg-purple-600 text-white' : 'bg-gray-300'
              }`}
            >
              {num}
            </div>
            <div className="text-sm">
              {num === 1 && 'Choose Style'}
              {num === 2 && 'Measurements'}
              {num === 3 && 'Review & Pay'}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 1: Choose Your Style</h2>
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
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {formData.categoryId && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">Style</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {styles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, styleId: style.id.toString() }))
                      }
                      className={`border rounded p-4 cursor-pointer ${
                        formData.styleId === style.id.toString() ? 'border-purple-600 bg-purple-50' : ''
                      }`}
                    >
                      <img
                        src={style.imageUrl || 'https://via.placeholder.com/200'}
                        alt={style.name}
                        className="w-full h-40 object-cover mb-2 rounded"
                      />
                      <h3 className="font-bold">{style.name}</h3>
                      <p className="text-sm text-gray-600">{style.description}</p>
                      <p className="font-bold text-purple-600 mt-2">
                        ₦{parseFloat(style.basePrice.toString()).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Material</label>
              <select
                name="materialId"
                value={formData.materialId}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-4 py-2"
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id.toString()}>
                    {mat.name} - ₦{parseFloat(mat.pricePerMeter.toString()).toLocaleString()}/meter
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.styleId || !formData.materialId}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:bg-gray-300"
            >
              Next: Measurements
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Enter Measurements</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-4 py-2"
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">Chest (inches)</label>
                <input
                  type="number"
                  name="chest"
                  value={formData.measurements.chest}
                  onChange={handleMeasurementChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Waist (inches)</label>
                <input
                  type="number"
                  name="waist"
                  value={formData.measurements.waist}
                  onChange={handleMeasurementChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Hips (inches)</label>
                <input
                  type="number"
                  name="hips"
                  value={formData.measurements.hips}
                  onChange={handleMeasurementChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Length (inches)</label>
                <input
                  type="number"
                  name="length"
                  value={formData.measurements.length}
                  onChange={handleMeasurementChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Special Instructions (Optional)</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={4}
                className="w-full border rounded px-4 py-2"
                placeholder="Any special requests or modifications?"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.size}
                className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:bg-gray-300"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 3: Review & Payment</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Style:</span> {selectedStyle?.name}
                </p>
                <p>
                  <span className="font-semibold">Material:</span> {selectedMaterial?.name}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {formData.size}
                </p>
                <p>
                  <span className="font-semibold">Base Price:</span>{' '}
                  ₦{selectedStyle && parseFloat(selectedStyle.basePrice.toString()).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Material Cost:</span>{' '}
                  ₦
                  {selectedMaterial &&
                    (parseFloat(selectedMaterial.pricePerMeter.toString()) * 2).toLocaleString()}
                </p>
                <hr className="my-2" />
                <p className="text-xl">
                  <span className="font-semibold">Total Price:</span> ₦{totalPrice.toLocaleString()}
                </p>
                <p className="text-lg text-purple-600">
                  <span className="font-semibold">Deposit (50%):</span> ₦{depositAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-100"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : `Pay Deposit ₦${depositAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomOrder;