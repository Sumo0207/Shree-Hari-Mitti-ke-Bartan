export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            about_content: {
                Row: {
                    id: string
                    section_key: string
                    title: string | null
                    title_en: string | null
                    title_hi: string | null
                    title_gu: string | null
                    content: string | null
                    content_en: string | null
                    content_hi: string | null
                    content_gu: string | null
                    image_url: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    section_key: string
                    title?: string | null
                    title_en?: string | null
                    title_hi?: string | null
                    title_gu?: string | null
                    content?: string | null
                    content_en?: string | null
                    content_hi?: string | null
                    content_gu?: string | null
                    image_url?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    section_key?: string
                    title?: string | null
                    title_en?: string | null
                    title_hi?: string | null
                    title_gu?: string | null
                    content?: string | null
                    content_en?: string | null
                    content_hi?: string | null
                    content_gu?: string | null
                    image_url?: string | null
                    updated_at?: string
                }
                Relationships: []
            },
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    username: string | null
                    avatar_url: string | null
                    role: 'admin' | 'user'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            products: {
                Row: {
                    id: string
                    name: string
                    name_en: string | null
                    name_hi: string | null
                    name_gu: string | null
                    description: string | null
                    description_en: string | null
                    description_hi: string | null
                    description_gu: string | null
                    story_en: string | null
                    story_hi: string | null
                    story_gu: string | null
                    category_id: string | null
                    image_url: string | null
                    visible: boolean
                    is_featured: boolean | null
                    size: string | null
                    material: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name_en?: string
                    name_hi?: string
                    name_gu?: string
                    description_en?: string | null
                    description_hi?: string | null
                    description_gu?: string | null
                    story_en?: string | null
                    story_hi?: string | null
                    story_gu?: string | null
                    category_id?: string | null
                    image_url?: string | null
                    visible?: boolean
                    is_featured?: boolean | null
                    size?: string | null
                    material?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name_en?: string
                    name_hi?: string
                    name_gu?: string
                    description_en?: string | null
                    description_hi?: string | null
                    description_gu?: string | null
                    story_en?: string | null
                    story_hi?: string | null
                    story_gu?: string | null
                    category_id?: string | null
                    image_url?: string | null
                    visible?: boolean
                    is_featured?: boolean | null
                    size?: string | null
                    material?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    name_en: string | null
                    name_hi: string | null
                    name_gu: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name_en: string
                    name_hi: string
                    name_gu: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name_en?: string
                    name_hi?: string
                    name_gu?: string
                    created_at?: string
                }
                Relationships: []
            }
            settings: {
                Row: {
                    id: number
                    business_name: string | null
                    business_name_en: string | null
                    business_name_hi: string | null
                    business_name_gu: string | null
                    phone: string | null
                    email: string | null
                    address: string | null
                    address_en: string | null
                    address_hi: string | null
                    address_gu: string | null
                    updated_at: string
                    whatsapp: string | null
                    google_map: string | null
                    instagram: string | null
                    facebook: string | null
                    youtube: string | null
                    logo_url: string | null
                    footer_text: string | null
                    footer_en: string | null
                    footer_hi: string | null
                    footer_gu: string | null
                    business_hours_days_en: string | null
                    business_hours_days_hi: string | null
                    business_hours_days_gu: string | null
                    business_hours_closed_en: string | null
                    business_hours_closed_hi: string | null
                    business_hours_closed_gu: string | null
                }
                Insert: {
                    id?: number
                    business_name_en?: string | null
                    business_name_hi?: string | null
                    business_name_gu?: string | null
                    phone?: string | null
                    email?: string | null
                    address_en?: string | null
                    address_hi?: string | null
                    address_gu?: string | null
                    updated_at?: string
                    whatsapp?: string | null
                    google_map?: string | null
                    instagram?: string | null
                    facebook?: string | null
                    youtube?: string | null
                    logo_url?: string | null
                    footer_en?: string | null
                    footer_hi?: string | null
                    footer_gu?: string | null
                    business_hours_days_en?: string | null
                    business_hours_days_hi?: string | null
                    business_hours_days_gu?: string | null
                    business_hours_closed_en?: string | null
                    business_hours_closed_hi?: string | null
                    business_hours_closed_gu?: string | null
                }
                Update: {
                    id?: number
                    business_name_en?: string | null
                    business_name_hi?: string | null
                    business_name_gu?: string | null
                    phone?: string | null
                    email?: string | null
                    address_en?: string | null
                    address_hi?: string | null
                    address_gu?: string | null
                    updated_at?: string
                    whatsapp?: string | null
                    google_map?: string | null
                    instagram?: string | null
                    facebook?: string | null
                    youtube?: string | null
                    logo_url?: string | null
                    footer_en?: string | null
                    footer_hi?: string | null
                    footer_gu?: string | null
                    business_hours_days_en?: string | null
                    business_hours_days_hi?: string | null
                    business_hours_days_gu?: string | null
                    business_hours_closed_en?: string | null
                    business_hours_closed_hi?: string | null
                    business_hours_closed_gu?: string | null
                }
                Relationships: []
            }
            gallery_images: {
                Row: {
                    id: string
                    image_url: string
                    caption: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    image_url: string
                    caption?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    image_url?: string
                    caption?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: 'admin' | 'user'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role: 'admin' | 'user'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role?: 'admin' | 'user'
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_roles_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            guides: {
                Row: {
                    id: string
                    title_en: string | null
                    title_hi: string | null
                    title_gu: string | null
                    content_en: string | null
                    content_hi: string | null
                    content_gu: string | null
                    thumbnail_url: string | null
                    visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title_en?: string | null
                    title_hi?: string | null
                    title_gu?: string | null
                    content_en?: string | null
                    content_hi?: string | null
                    content_gu?: string | null
                    thumbnail_url?: string | null
                    visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title_en?: string | null
                    title_hi?: string | null
                    title_gu?: string | null
                    content_en?: string | null
                    content_hi?: string | null
                    content_gu?: string | null
                    thumbnail_url?: string | null
                    visible?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            testimonials: {
                Row: {
                    id: string
                    customer_name: string
                    customer_name_en: string | null
                    customer_name_hi: string | null
                    customer_name_gu: string | null
                    customer_location: string | null
                    message: string
                    message_en: string | null
                    message_hi: string | null
                    message_gu: string | null
                    rating: number | null
                    display_order: number
                    is_active: boolean
                    user_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    customer_name: string
                    customer_name_en?: string | null
                    customer_name_hi?: string | null
                    customer_name_gu?: string | null
                    customer_location?: string | null
                    message: string
                    message_en?: string | null
                    message_hi?: string | null
                    message_gu?: string | null
                    rating?: number | null
                    display_order?: number
                    is_active?: boolean
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    customer_name?: string
                    customer_name_en?: string | null
                    customer_name_hi?: string | null
                    customer_name_gu?: string | null
                    customer_location?: string | null
                    message?: string
                    message_en?: string | null
                    message_hi?: string | null
                    message_gu?: string | null
                    rating?: number | null
                    display_order?: number
                    is_active?: boolean
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "testimonials_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            app_role: 'admin' | 'user'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
