"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: {
        name: string;
        category: string;
        image_url?: string;
    };
}

interface Order {
    id: string;
    parent_name: string;
    phone: string;
    total: number;
    status: string;
    class_id: string;
    created_at: string;
    address: string;
    classes?: {
        name: string;
        schools?: {
            name: string;
        };
    };
}

interface OrderWithItems extends Order {
    order_items?: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (searchPhone.trim() === "") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(
                orders.filter(order =>
                    order.phone.includes(searchPhone.trim())
                )
            );
        }
    }, [orders, searchPhone]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    *,
                    classes (
                        name,
                        schools (
                            name
                        )
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err: any) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId: string) => {
        setLoadingDetails(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    *,
                    classes (
                        name,
                        schools (
                            name
                        )
                    ),
                    order_items (
                        id,
                        product_id,
                        quantity,
                        price,
                        products (
                            name,
                            category,
                            image_url
                        )
                    )
                `)
                .eq("id", orderId)
                .single();

            if (error) throw error;
            setSelectedOrder(data);
        } catch (err: any) {
            console.error("Error fetching order details:", err);
            setError("Failed to load order details.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleOrderClick = (order: Order) => {
        fetchOrderDetails(order.id);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;

            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err: any) {
            console.error("Error updating order:", err);
            setError(err.message || "Failed to update order status.");
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "new":
                return "status-pill status-pill-new";
            case "confirmed":
                return "status-pill status-pill-confirmed";
            case "delivered":
                return "status-pill status-pill-delivered";
            default:
                return "status-pill bg-slate-100 text-slate-800";
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Orders</h2>
                <p className="text-slate-600">Manage customer orders and track deliveries</p>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Search by Phone
                    </label>
                    <input
                        type="text"
                        placeholder="Enter phone number..."
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        className="premium-input"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                </div>
            )}

            {/* Premium Table Container */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-slate-600 font-medium">No orders found</p>
                        <p className="text-slate-500 text-sm mt-1">Orders will appear here once customers start placing them</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Parent Name</th>
                                    <th>Phone</th>
                                    <th>School</th>
                                    <th>Class</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => handleOrderClick(order)}
                                        className="cursor-pointer"
                                    >
                                        <td>
                                            <span className="font-mono text-xs font-semibold text-blue-600">
                                                {order.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-medium text-slate-900">{order.parent_name}</span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-sm">{order.phone}</span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-slate-700">
                                                {order.classes?.schools?.name || "-"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-slate-700">
                                                {order.classes?.name || "-"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-900">₹{order.total.toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <span className={getStatusClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-slate-600">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="new">New</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Count */}
            {filteredOrders.length > 0 && (
                <div className="mt-4 text-sm text-slate-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {loadingDetails ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-slate-600">Loading order details...</p>
                            </div>
                        ) : (
                            <>
                                {/* Modal Header */}
                                <div className="p-6 border-b border-slate-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                                Order Details
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                Order ID: <span className="font-mono font-semibold text-blue-600">{selectedOrder.id.substring(0, 8).toUpperCase()}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-6">
                                    {/* Customer Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h4>
                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Parent Name</p>
                                                <p className="text-sm font-medium text-slate-900">{selectedOrder.parent_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</p>
                                                <p className="text-sm font-mono font-medium text-slate-900">{selectedOrder.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Delivery Address</p>
                                                <p className="text-sm text-slate-900">{selectedOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* School & Class */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4">School & Class</h4>
                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">School</p>
                                                <p className="text-sm font-medium text-slate-900">{selectedOrder.classes?.schools?.name || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Class</p>
                                                <p className="text-sm font-medium text-slate-900">{selectedOrder.classes?.name || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h4>
                                        <div className="space-y-3">
                                            {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                                                selectedOrder.order_items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 bg-slate-50 rounded-lg p-4">
                                                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {item.products?.image_url ? (
                                                                <img
                                                                    src={item.products.image_url}
                                                                    alt={item.products.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-slate-900">{item.products?.name || "Unknown Product"}</p>
                                                            <p className="text-xs text-slate-600">{item.products?.category || ""}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                                                            <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-500 italic">No items found</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h4>
                                        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600">Status</span>
                                                <span className={getStatusClass(selectedOrder.status)}>
                                                    {selectedOrder.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600">Order Date</span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {new Date(selectedOrder.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="border-t border-slate-200 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-slate-900">Total Amount</span>
                                                    <span className="text-2xl font-bold text-blue-600">₹{selectedOrder.total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Update Status */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Update Status</h4>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                            className="premium-input"
                                        >
                                            <option value="new">New</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
