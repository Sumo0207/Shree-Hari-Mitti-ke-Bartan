import { supabase } from './supabase';
import { Database } from './types';

// Products
export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visible', true);
    if (error) throw error;
    return data;
}

export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

export async function getFeaturedProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visible', true)
        .eq('is_featured', true);
    if (error) throw error;
    return data;
}

// Categories
export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');
    if (error) throw error;
    return data;
}

// Settings
export async function getSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
    if (error) throw error;
    return data;
}

// About Content
export async function getAboutContent() {
    const { data, error } = await supabase
        .from('about_content')
        .select('*');
    if (error) throw error;
    return data;
}

// Gallery Images
export async function getGalleryImages() {
    const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// Testimonials
export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
}

// Guides
export async function getGuides() {
    const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('visible', true);
    if (error) throw error;
    return data;
}

// Auth
export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
