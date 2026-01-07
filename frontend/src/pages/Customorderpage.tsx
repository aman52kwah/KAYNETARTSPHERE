import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Ruler, Palette, DollarSign, Check, AlertCircle } from 'lucide-react';

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    
    // Style Selection
    garmentType: '',
    style: '',
    occasion: '',
    
    // Measurements
    bust: '',
    waist: '',
    hips: '',
    shoulder: '',
    sleeves: '',
    length: '',
    
    // Material & Design
    fabricType: '',
    fabricColor: '',
    designDetails: '',
    referenceImage: null as File | null,
    
    // Additional
    urgency: 'standard',
    specialRequests: ''
  });

  const garmentTypes = [
    { value: 'dress', label: 'Dress', price: 250, icon: '👗' },
    { value: 'suit', label: 'Suit', price: 500, icon: '🤵' },
    { value: 'shirt', label: 'Shirt', price: 150, icon: '👔' },
    { value: 'skirt', label: 'Skirt', price: 120, icon: '👚' },
    { value: 'pants', label: 'Pants', price: 180, icon: '👖' },
    { value: 'kaftan', label: 'Kaftan', price: 280, icon: '🧥' },
  ];

  const fabricTypes = [
    { value: 'cotton', label: 'Cotton', price: 200 },
    { value: 'silk', label: 'Silk', price: 100 },
    { value: 'linen', label: 'Linen', price: 50 },
    { value: 'velvet', label: 'Velvet', price: 150 },
    { value: 'chiffon', label: 'Chiffon', price: 80 },
    { value: 'satin', label: 'Satin', price: 120 },
  ];

  const urgencyOptions = [
    { value: 'standard', label: 'Standard (3-4 weeks)', price: 0 },
    { value: 'express', label: 'Express (2 weeks)', price: 100 },
    { value: 'rush', label: 'Rush (1 week)', price: 200 },
  ];

  const calculateTotal = () => {
    const garment = garmentTypes.find(g => g.value === formData.garmentType);
    const fabric = fabricTypes.find(f => f.value === formData.fabricType);
    const urgency = urgencyOptions.find(u => u.value === formData.urgency);
    
    const basePrice = garment?.price || 0;
    const fabricPrice = fabric?.price || 0;
    const urgencyPrice = urgency?.price || 0;
    
    return basePrice + fabricPrice + urgencyPrice;
  };

  const getDeposit = () => {
    return calculateTotal() * 0.5; // 50% deposit
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;

      case 2:
        if (!formData.garmentType) newErrors.garmentType = 'Please select a garment type';
        break;

      case 3:
        if (!formData.bust) newErrors.bust = 'Bust/Chest measurement is required';
        if (!formData.waist) newErrors.waist = 'Waist measurement is required';
        if (!formData.hips) newErrors.hips = 'Hips measurement is required';
        if (!formData.length) newErrors.length = 'Length measurement is required';
        break;

      case 4:
        if (!formData.fabricType) newErrors.fabricType = 'Please select a fabric type';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, current step:', step);
    console.log('Form data:', formData);

    if (!validateStep(step)) {
      console.log('Validation failed:', errors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step < 4) {
      console.log('Moving to next step');
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('Final step - preparing checkout data');
      
      const total = calculateTotal();
      const deposit = getDeposit();
      
      // Get garment details for display
      const selectedGarment = garmentTypes.find(g => g.value === formData.garmentType);
      const selectedFabric = fabricTypes.find(f => f.value === formData.fabricType);
      const selectedUrgency = urgencyOptions.find(u => u.value === formData.urgency);
      
      const checkoutData = {
        orderType: 'custom',
        customOrder: {
          ...formData,
          garmentLabel: selectedGarment?.label,
          fabricLabel: selectedFabric?.label,
          urgencyLabel: selectedUrgency?.label,
        },
        total,
        deposit,
        items: [
          {
            id: 'custom-order-' + Date.now(),
            name: `Custom ${selectedGarment?.label || 'Garment'}`,
            description: `${selectedFabric?.label} - ${selectedUrgency?.label}`,
            price: total,
            quantity: 1,
            image: selectedGarment?.icon,
          }
        ]
      };
      
      console.log('Checkout data:', checkoutData);
      
      // Store in sessionStorage as backup
      sessionStorage.setItem('customOrderCheckout', JSON.stringify(checkoutData));
      
      // Navigate to checkout with state
      navigate('/checkout', { 
        state: checkoutData,
        replace: false
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold serif mb-6 text-gray-700">Personal Information</h2>
            
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-red-700 text-sm mt-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  errors.fullName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="kaynetartsphere@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.phone 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="+233 12 345 678"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold serif mb-6 text-gray-700">Style Selection</h2>
            
            {errors.garmentType && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700">{errors.garmentType}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Garment Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {garmentTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, garmentType: type.value }));
                      if (errors.garmentType) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.garmentType;
                          return newErrors;
                        });
                      }
                    }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.garmentType === type.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-gray-700">{type.label}</div>
                    <div className="text-sm text-gray-600">GH₵ {type.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Style Description</label>
              <textarea
                name="style"
                value={formData.style}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Describe your desired style (e.g., elegant, casual, modern, traditional)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Occasion</label>
              <input
                type="text"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Wedding, Party, Business Meeting, etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold serif mb-6 text-gray-700">Measurements</h2>
            <p className="text-gray-600 mb-6">
              Please provide your measurements in inches. If you need assistance, we can schedule a fitting appointment.
            </p>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Please provide required measurements:</p>
                  <ul className="list-disc list-inside text-red-700 text-sm mt-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Bust/Chest *</label>
                <input
                  type="number"
                  name="bust"
                  value={formData.bust}
                  onChange={handleChange}
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.bust 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="e.g., 36"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Waist *</label>
                <input
                  type="number"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.waist 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="e.g., 28"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Hips *</label>
                <input
                  type="number"
                  name="hips"
                  value={formData.hips}
                  onChange={handleChange}
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.hips 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="e.g., 38"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Shoulder Width</label>
                <input
                  type="number"
                  name="shoulder"
                  value={formData.shoulder}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g., 16"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Sleeve Length</label>
                <input
                  type="number"
                  name="sleeves"
                  value={formData.sleeves}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g., 24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Length *</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    errors.length 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="e.g., 42"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold serif mb-6 text-gray-700">Material & Design Details</h2>
            
            {errors.fabricType && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700">{errors.fabricType}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Fabric Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fabricTypes.map(fabric => (
                  <button
                    key={fabric.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, fabricType: fabric.value }));
                      if (errors.fabricType) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.fabricType;
                          return newErrors;
                        });
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.fabricType === fabric.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-700">{fabric.label}</div>
                    <div className="text-sm text-gray-600">
                      {fabric.price > 0 ? `+GH₵ ${fabric.price}` : 'Base price'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Fabric Color</label>
              <input
                type="text"
                name="fabricColor"
                value={formData.fabricColor}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., Royal Blue, Emerald Green, Burgundy"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Design Details</label>
              <textarea
                name="designDetails"
                value={formData.designDetails}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Describe any specific design elements (embroidery, buttons, pleats, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Reference Image (Optional)</label>
              <input
                type="file"
                name="referenceImage"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">Upload an inspiration image or sketch</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Urgency Level</label>
              <div className="space-y-3">
                {urgencyOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.urgency === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        checked={formData.urgency === option.value}
                        onChange={handleChange}
                        className="text-purple-600"
                      />
                      <span className="font-semibold text-gray-700">{option.label}</span>
                    </div>
                    <span className="text-gray-600">
                      {option.price > 0 ? `+GH₵ ${option.price}` : 'No extra charge'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Any other special requirements or requests?"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-purple-50 rounded-xl p-6 space-y-3">
              <h3 className="font-bold text-lg mb-4 text-gray-700">Order Summary</h3>
              <div className="flex justify-between text-gray-700">
                <span>Base Price:</span>
                <span className="font-semibold">GH₵ {garmentTypes.find(g => g.value === formData.garmentType)?.price || 0}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Fabric Upgrade:</span>
                <span className="font-semibold">GH₵ {fabricTypes.find(f => f.value === formData.fabricType)?.price || 0}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Urgency Fee:</span>
                <span className="font-semibold">GH₵ {urgencyOptions.find(u => u.value === formData.urgency)?.price || 0}</span>
              </div>
              <div className="border-t-2 border-purple-200 pt-3 mt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-700">Total:</span>
                  <span className="font-bold text-green-600">GH₵ {calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600 mt-2">
                  <span>50% Deposit Required:</span>
                  <span className="font-semibold">GH₵ {getDeposit()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                  step >= num
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > num ? <Check size={24} /> : num}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8 md:p-12">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setErrors({});
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
              >
                Previous
              </button>
            )}
            
            <button
              type="submit"
              className={`px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg ${
                step === 1 ? 'ml-auto' : ''
              }`}
            >
              {step === 4 ? 'Proceed to Payment' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CustomOrderPage;