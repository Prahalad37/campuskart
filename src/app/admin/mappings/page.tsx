"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface School {
    id: string;
    name: string;
}

interface Class {
    id: string;
    name: string;
    school_id: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface ClassProduct {
    product_id: string;
    quantity: number;
}

export default function MappingsPage() {
    const [schools, setSchools] = useState<School[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [existingMappings, setExistingMappings] = useState<Set<string>>(new Set());
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSchools();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedSchool) {
            fetchClasses(selectedSchool);
        } else {
            setClasses([]);
            setSelectedClass("");
        }
    }, [selectedSchool]);

    useEffect(() => {
        if (selectedClass) {
            fetchExistingMappings(selectedClass);
        } else {
            setExistingMappings(new Set());
            setSelectedProducts(new Set());
        }
    }, [selectedClass]);

    const fetchSchools = async () => {
        try {
            const { data, error } = await supabase
                .from("schools")
                .select("id, name")
                .order("name");

            if (error) throw error;
            setSchools(data || []);
        } catch (err: any) {
            console.error("Error fetching schools:", err);
            setError(err.message);
        }
    };

    const fetchClasses = async (schoolId: string) => {
        try {
            const { data, error } = await supabase
                .from("classes")
                .select("id, name, school_id")
                .eq("school_id", schoolId)
                .order("name");

            if (error) throw error;
            setClasses(data || []);
        } catch (err: any) {
            console.error("Error fetching classes:", err);
            setError(err.message);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, price")
                .order("name");

            if (error) throw error;
            setProducts(data || []);
        } catch (err: any) {
            console.error("Error fetching products:", err);
            setError(err.message);
        }
    };

    const fetchExistingMappings = async (classId: string) => {
        try {
            const { data, error } = await supabase
                .from("class_products")
                .select("product_id")
                .eq("class_id", classId);

            if (error) throw error;

            const productIds = new Set(data?.map((m) => m.product_id) || []);
            setExistingMappings(productIds);
            setSelectedProducts(productIds);
        } catch (err: any) {
            console.error("Error fetching mappings:", err);
            setError(err.message);
        }
    };

    const toggleProduct = (productId: string) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const handleSave = async () => {
        if (!selectedClass) {
            setError("Please select a class");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Delete existing mappings
            const { error: deleteError } = await supabase
                .from("class_products")
                .delete()
                .eq("class_id", selectedClass);

            if (deleteError) throw deleteError;

            // Insert new mappings
            if (selectedProducts.size > 0) {
                const mappings = Array.from(selectedProducts).map((productId) => ({
                    class_id: selectedClass,
                    product_id: productId,
                    quantity: 1,
                }));

                const { error: insertError } = await supabase
                    .from("class_products")
                    .insert(mappings);

                if (insertError) throw insertError;
            }

            setSuccess("Product mappings saved successfully!");
            fetchExistingMappings(selectedClass);
        } catch (err: any) {
            console.error("Error saving mappings:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary">Product to Class Mappings</h2>
                <p className="text-secondary">Map products to specific classes</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Selection Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-card p-6 border border-gray-100 sticky top-4">
                        <h3 className="text-lg font-semibold text-primary mb-4">Select Class</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="institutional-label">School</label>
                                <select
                                    value={selectedSchool}
                                    onChange={(e) => setSelectedSchool(e.target.value)}
                                    className="institutional-input"
                                >
                                    <option value="">Select a school</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="institutional-label">Class</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="institutional-input"
                                    disabled={!selectedSchool}
                                >
                                    <option value="">Select a class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-secondary mb-2">
                                    Selected: {selectedProducts.size} product(s)
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedClass || loading}
                                    className="institutional-button-primary w-full"
                                >
                                    {loading ? "Saving..." : "Save Mappings"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-primary">
                                Available Products
                            </h3>
                            <p className="text-sm text-secondary mt-1">
                                {selectedClass
                                    ? "Select products for this class"
                                    : "Please select a class first"}
                            </p>
                        </div>

                        {selectedClass ? (
                            <div className="p-6">
                                {products.length === 0 ? (
                                    <p className="text-center text-secondary py-8">
                                        No products available. Add products first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {products.map((product) => (
                                            <label
                                                key={product.id}
                                                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedProducts.has(product.id)
                                                        ? "border-primary bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.has(product.id)}
                                                    onChange={() => toggleProduct(product.id)}
                                                    className="w-5 h-5 text-primary"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-primary">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-secondary">
                                                        ₹{product.price}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-secondary">
                                Select a school and class to begin mapping products
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
