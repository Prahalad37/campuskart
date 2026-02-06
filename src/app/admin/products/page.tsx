"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
    image?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        type: "stationery",
        image: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err: any) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        // Validate price
        const priceNum = parseInt(formData.price);
        if (isNaN(priceNum) || priceNum <= 0) {
            setError("Price must be a positive number.");
            setSubmitting(false);
            return;
        }

        try {
            const { error } = await supabase.from("products").insert([
                {
                    name: formData.name,
                    price: parseInt(formData.price),
                    type: formData.type,
                    image: formData.image || null,
                },
            ]);

            if (error) throw error;

            setSuccess("Product added successfully!");
            setFormData({ name: "", price: "", type: "stationery", image: "" });
            setShowForm(false);
            fetchProducts();
        } catch (err: any) {
            console.error("Error adding product:", err);
            setError(err.message || "Failed to add product. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase.from("products").delete().eq("id", id);

            if (error) throw error;

            setSuccess("Product deleted successfully!");
            fetchProducts();
        } catch (err: any) {
            console.error("Error deleting product:", err);
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Products</h2>
                    <p className="text-secondary">Manage product catalog</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="institutional-button-primary"
                >
                    {showForm ? "Cancel" : "+ Add Product"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-lg shadow-card p-6 mb-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-primary mb-4">Add New Product</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="institutional-label">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="e.g., Notebook Set"
                                    required
                                />
                            </div>
                            <div>
                                <label className="institutional-label">Price (₹) *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="e.g., 250"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="institutional-label">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                    className="institutional-input"
                                    required
                                >
                                    <option value="uniform">Uniform</option>
                                    <option value="book">Book</option>
                                    <option value="stationery">Stationery</option>
                                </select>
                            </div>
                            <div>
                                <label className="institutional-label">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="institutional-button-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Adding..." : "Add Product"}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-card border border-gray-100">
                {loading ? (
                    <div className="p-8 text-center text-secondary">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center text-secondary">
                        No products found. Add your first product above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <div className="font-medium text-primary">
                                                    {product.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {product.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
