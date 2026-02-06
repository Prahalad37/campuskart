import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface School {
    id: string;
    name: string;
    slug: string;
    address?: string;
    contact?: string;
    email?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Class {
    id: string;
    school_id: string;
    name: string;
    grade?: string;
    section?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    type?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClassProduct {
    id: string;
    class_id: string;
    product_id: string;
    quantity?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Order {
    id: string;
    parent_name: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    class_id?: string;
    created_at?: string;
    updated_at?: string;
}

// Helper functions for data fetching

/**
 * Fetch school by slug
 */
export async function getSchoolBySlug(slug: string): Promise<School | null> {
    const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching school:', error);
        return null;
    }

    return data;
}

/**
 * Fetch classes for a school
 */
export async function getClassesBySchoolId(schoolId: string): Promise<Class[]> {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching classes:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch products for a class
 */
export async function getProductsByClassId(classId: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('class_products')
        .select(`
      product_id,
      quantity,
      products (
        id,
        name,
        price,
        image,
        type,
        description
      )
    `)
        .eq('class_id', classId);

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Extract products from the join
    return data?.map((item: any) => item.products).filter(Boolean) || [];
}

/**
 * Fetch all products
 */
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

/**
 * Create an order
 */
export async function createOrder(orderData: {
    parent_name: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    class_id?: string;
}): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

    if (error) {
        console.error('Error creating order:', error);
        return null;
    }

    return data;
}
