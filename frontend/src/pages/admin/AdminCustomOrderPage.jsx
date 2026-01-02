import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Eye, Check, X } from 'lucide-react';

const AdminCustomOrders = () => {
  const [customOrders] = useState([
    {
      id: 'CUSTOM-001',
      customer: 'Afia Mensah',
      garmentType: 'Dress',
      measurements: { bust: 36, waist: 28, hips: 38 },
      fabric: 'Silk',
      total: 450,
      deposit: 225,
      status: 'Pending Review',
      date: '2024-12-17'
    },
    {
      id: 'CUSTOM-002',
      customer: 'Kwame Osei',
      garmentType: 'Suit',
      measurements: { chest: 42, waist: 34, shoulders: 18 },
      fabric: 'Velvet',
      total: 650,
      deposit: 325,
      status: 'In Progress',
      date: '2024-12-16'
    },
  ]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold serif mb-12">Custom Orders</h1>

        <div className="space-y-6">
          {customOrders.map((order) => (
            <div key={order.id} className="glass-effect rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{order.id}</h3>
                  <p className="text-gray-600">{order.customer} • {order.date}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-600' :
                  order.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                  order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Garment Details</h4>
                  <p className="text-gray-600">Type: {order.garmentType}</p>
                  <p className="text-gray-600">Fabric: {order.fabric}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Measurements</h4>
                  {Object.entries(order.measurements).map(([key, value]) => (
                    <p key={key} className="text-gray-600">{key}: {value}"</p>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Payment</h4>
                  <p className="text-gray-600">Total: GH₵ {order.total}</p>
                  <p className="text-green-600 font-semibold">Deposit Paid: GH₵ {order.deposit}</p>
                  <p className="text-gray-600">Balance: GH₵ {order.total - order.deposit}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <Eye size={20} />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  <Check size={20} />
                  Mark Complete
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                  <X size={20} />
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCustomOrders;