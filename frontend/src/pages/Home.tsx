import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Fashion Studio</h1>
            <p className="text-xl mb-8">Create Your Perfect Style or Shop Ready-Made Collections</p>
            <div className="space-x-4">
              <Link
                to="/custom-order"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
              >
                Custom Order
              </Link>
              <Link
                to="/shop"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Custom Designs</h3>
            <p className="text-gray-600">
              Choose your style, size, and material. We'll create exactly what you envision.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👗</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Ready-Made Fashion</h3>
            <p className="text-gray-600">
              Browse our collection of ready-to-wear pieces for immediate purchase.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Payment</h3>
            <p className="text-gray-600">
              Pay 50% upfront for custom orders. Secure payment via Paystack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;