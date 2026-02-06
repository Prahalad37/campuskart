"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface School {
    id: string;
    name: string;
    slug: string;
    address: string;
    contact: string;
    email?: string;
}

export default function SchoolsPage() {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        address: "",
        contact: "",
        email: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const { data, error } = await supabase
                .from("schools")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSchools(data || []);
        } catch (err: any) {
            console.error("Error fetching schools:", err);
            setError("Failed to load schools. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const { error } = await supabase.from("schools").insert([
                {
                    name: formData.name,
                    slug: formData.slug,
                    address: formData.address,
                    contact: formData.contact,
                    email: formData.email || null,
                },
            ]);

            if (error) throw error;

            setSuccess("School added successfully!");
            setFormData({ name: "", slug: "", address: "", contact: "", email: "" });
            setShowForm(false);
            fetchSchools();
        } catch (err: any) {
            console.error("Error adding school:", err);
            setError(err.message || "Failed to add school. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this school?")) return;

        try {
            const { error } = await supabase.from("schools").delete().eq("id", id);

            if (error) throw error;

            setSuccess("School deleted successfully!");
            fetchSchools();
        } catch (err: any) {
            console.error("Error deleting school:", err);
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Schools</h2>
                    <p className="text-secondary">Manage educational institutions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="institutional-button-primary"
                >
                    {showForm ? "Cancel" : "+ Add School"}
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
                    <h3 className="text-lg font-semibold text-primary mb-4">Add New School</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="institutional-label">School Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="e.g., Delhi Public School"
                                    required
                                />
                            </div>
                            <div>
                                <label className="institutional-label">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="e.g., dps-rohini"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="institutional-label">Address *</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="institutional-input"
                                placeholder="Full address"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="institutional-label">Contact Number *</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) =>
                                        setFormData({ ...formData, contact: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="Contact number"
                                    required
                                />
                            </div>
                            <div>
                                <label className="institutional-label">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="institutional-input"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            className="institutional-button-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Adding..." : "Add School"}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-card border border-gray-100">
                {loading ? (
                    <div className="p-8 text-center text-secondary">Loading schools...</div>
                ) : schools.length === 0 ? (
                    <div className="p-8 text-center text-secondary">
                        No schools found. Add your first school above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-primary">
                                                {school.name}
                                            </div>
                                            {school.email && (
                                                <div className="text-sm text-secondary">
                                                    {school.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                            {school.slug}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                            {school.contact}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary">
                                            {school.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDelete(school.id)}
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
