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
    grade?: string;
    section?: string;
    school_id: string;
    schools?: School;
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        school_id: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchSchools();
        fetchClasses();
    }, []);

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

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from("classes")
                .select("*, schools(id, name)")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setClasses(data || []);
        } catch (err: any) {
            console.error("Error fetching classes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const { error } = await supabase.from("classes").insert([
                {
                    name: formData.name,
                    school_id: formData.school_id,
                },
            ]);

            if (error) throw error;

            setSuccess("Class added successfully!");
            setFormData({ name: "", school_id: "" });
            setShowForm(false);
            fetchClasses();
        } catch (err: any) {
            console.error("Error adding class:", err);
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            const { error } = await supabase.from("classes").delete().eq("id", id);

            if (error) throw error;

            setSuccess("Class deleted successfully!");
            fetchClasses();
        } catch (err: any) {
            console.error("Error deleting class:", err);
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Classes</h2>
                    <p className="text-secondary">Manage classes for each school</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="institutional-button-primary"
                >
                    {showForm ? "Cancel" : "+ Add Class"}
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
                    <h3 className="text-lg font-semibold text-primary mb-4">Add New Class</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="institutional-label">School *</label>
                            <select
                                value={formData.school_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, school_id: e.target.value })
                                }
                                className="institutional-input"
                                required
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
                            <label className="institutional-label">Class Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="institutional-input"
                                placeholder="e.g., Class 1A"
                                required
                            />
                        </div>

                        <button type="submit" className="institutional-button-primary">
                            Add Class
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-card border border-gray-100">
                {loading ? (
                    <div className="p-8 text-center text-secondary">Loading classes...</div>
                ) : classes.length === 0 ? (
                    <div className="p-8 text-center text-secondary">
                        No classes found. Add your first class above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Class Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        School
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-primary">
                                                {cls.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                            {cls.schools?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDelete(cls.id)}
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
