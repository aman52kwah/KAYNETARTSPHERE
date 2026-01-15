import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Eye, Check, X, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const AdminCustomOrders = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const fetchCustomOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/admin/custom-orders`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch custom orders: ${response.status}`);
      }

      const data = await response.json();
      console.log("Custom orders fetched:", data);
      setCustomOrders(data);
    } catch (err) {
      console.error("Error fetching custom orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch(
        `${API_URL}/api/admin/custom-orders/${orderId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh the orders list
      await fetchCustomOrders();
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleMarkComplete = (orderId) => {
    if (confirm("Mark this order as completed?")) {
      updateOrderStatus(orderId, "completed");
    }
  };

  const handleCancelOrder = (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      updateOrderStatus(orderId, "cancelled");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-600",
      in_progress: "bg-blue-100 text-blue-600",
      completed: "bg-green-100 text-green-600",
      cancelled: "bg-red-100 text-red-600",
    };

    const statusLabel = {
      pending: "Pending Review",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          statusMap[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {statusLabel[status] || status}
      </span>
    );
  };

  const parseMeasurements = (measurementData) => {
    try {
      if (typeof measurementData === "string") {
        return JSON.parse(measurementData);
      }
      return measurementData || {};
    } catch (err) {
      console.error("Error parsing measurements:", err);
      return {};
    }
  };

  if (loading) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading custom orders...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchCustomOrders}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold serif text-gray-800">Custom Orders</h1>
          <div className="text-sm text-gray-600">
            {customOrders.length}{" "}
            {customOrders.length === 1 ? "order" : "orders"}
          </div>
        </div>

        {customOrders.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg">No custom orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {customOrders.map((order) => {
              const measurements = parseMeasurements(order.measurements);

              return (
                <div key={order.id} className="glass-effect rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-600">
                        CUSTOM-{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        {order.fullName ||
                          order.user?.name ||
                          "Unknown Customer"}{" "}
                        • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700">Garment Details</h4>
                      <p className="text-gray-600">
                        Type: {order.garmentLabel || order.garmentType}
                      </p>
                      <p className="text-gray-600">
                        Fabric: {order.fabricLabel || order.fabricType}
                      </p>
                      {order.fabricColor && (
                        <p className="text-gray-600">
                          Color: {order.fabricColor}
                        </p>
                      )}
                      {order.urgencyLabel && (
                        <p className="text-gray-600 mt-2 text-sm">
                          Timeline: {order.urgencyLabel}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700">Measurements</h4>
                      {Object.entries(measurements).map(
                        ([key, value]) =>
                          value && (
                            <p key={key} className="text-gray-600 capitalize">
                              {key}: {value}"
                            </p>
                          )
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Payment</h4>
                      <p className="text-gray-600">
                        Total: GH₵{" "}
                        {parseFloat(order.totalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-green-600 font-semibold">
                        Deposit Paid: GH₵{" "}
                        {parseFloat(order.depositAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        Balance: GH₵{" "}
                        {parseFloat(order.balanceAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Payment:{" "}
                        {order.paymentStatus?.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Contact & Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700">Contact</h4>
                      <p className="text-gray-600 text-sm">
                        Email: {order.email}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Phone: {order.phone}
                      </p>
                    </div>
                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Shipping Address</h4>
                        <p className="text-gray-600 text-sm">
                          {order.shippingAddress}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {(order.occasion ||
                    order.designDetails ||
                    order.specialRequests) && (
                    <div className="pt-6 border-t mb-6">
                      <h4 className="font-semibold mb-2 text-gray-700">Additional Details</h4>
                      {order.occasion && (
                        <p className="text-gray-600 text-sm mb-1">
                          Occasion: {order.occasion}
                        </p>
                      )}
                      {order.designDetails && (
                        <p className="text-gray-600 text-sm mb-1">
                          Design: {order.designDetails}
                        </p>
                      )}
                      {order.specialRequests && (
                        <p className="text-gray-600 text-sm">
                          Special Requests: {order.specialRequests}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        (window.location.href = `/admin/custom-orders/${order.id}`)
                      }
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={20} />
                      View Details
                    </button>

                    {order.status !== "completed" &&
                      order.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => handleMarkComplete(order.id)}
                            disabled={updatingOrderId === order.id}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check size={20} />
                            {updatingOrderId === order.id
                              ? "Updating..."
                              : "Mark Complete"}
                          </button>

                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={updatingOrderId === order.id}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={20} />
                            Cancel Order
                          </button>
                        </>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCustomOrders;
