export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content: string | null
          content_en: string | null
          content_hi: string | null
          content_gu: string | null
          id: string
          image_url: string | null
          section_key: string
          title: string | null
          title_en: string | null
          title_hi: string | null
          title_gu: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_en?: string | null
          content_hi?: string | null
          content_gu?: string | null
          id?: string
          image_url?: string | null
          section_key: string
          title?: string | null
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_en?: string | null
          content_hi?: string | null
          content_gu?: string | null
          id?: string
          image_url?: string | null
          section_key?: string
          title?: string | null
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          name_en: string | null
          name_hi: string | null
          name_gu: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_en?: string | null
          name_hi?: string | null
          name_gu?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_en?: string | null
          name_hi?: string | null
          name_gu?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string | null
          description: string | null
          description_en: string | null
          description_hi: string | null
          description_gu: string | null
          display_order: number | null
          id: string
          image_url: string
          title: string | null
          title_en: string | null
          title_hi: string | null
          title_gu: string | null
          caption: string | null
          caption_en: string | null
          caption_hi: string | null
          caption_gu: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_hi?: string | null
          description_gu?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          title?: string | null
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          caption?: string | null
          caption_en?: string | null
          caption_hi?: string | null
          caption_gu?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_hi?: string | null
          description_gu?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          title?: string | null
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          caption?: string | null
          caption_en?: string | null
          caption_hi?: string | null
          caption_gu?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      guides: {
        Row: {
          category: string
          content_en: string | null
          content_hi: string | null
          content_gu: string | null
          created_at: string
          id: string
          thumbnail_url: string | null
          slug: string
          title_en: string | null
          title_hi: string | null
          title_gu: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          category: string
          content_en?: string | null
          content_hi?: string | null
          content_gu?: string | null
          created_at?: string
          id?: string
          thumbnail_url?: string | null
          slug: string
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string
          content_en?: string | null
          content_hi?: string | null
          content_gu?: string | null
          created_at?: string
          id?: string
          thumbnail_url?: string | null
          slug?: string
          title_en?: string | null
          title_hi?: string | null
          title_gu?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          message: string
          product_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          message: string
          product_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          message?: string
          product_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          description_en: string | null
          description_hi: string | null
          description_gu: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          material: string | null
          name: string
          name_en: string | null
          name_hi: string | null
          name_gu: string | null
          size: string | null
          story: string | null
          story_en: string | null
          story_hi: string | null
          story_gu: string | null
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_hi?: string | null
          description_gu?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          material?: string | null
          name: string
          name_en?: string | null
          name_hi?: string | null
          name_gu?: string | null
          size?: string | null
          story?: string | null
          story_en?: string | null
          story_hi?: string | null
          story_gu?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_hi?: string | null
          description_gu?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          material?: string | null
          name?: string
          name_en?: string | null
          name_hi?: string | null
          name_gu?: string | null
          size?: string | null
          story?: string | null
          story_en?: string | null
          story_hi?: string | null
          story_gu?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          theme_preference: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string | null
          address_en: string | null
          address_hi: string | null
          address_gu: string | null
          business_name: string | null
          business_name_en: string | null
          business_name_hi: string | null
          business_name_gu: string | null
          email: string | null
          facebook: string | null
          footer_text: string | null
          footer_en: string | null
          footer_hi: string | null
          footer_gu: string | null
          google_map: string | null
          id: number
          instagram: string | null
          logo_url: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
          youtube: string | null
          business_hours_days_en: string | null
          business_hours_days_hi: string | null
          business_hours_days_gu: string | null
          business_hours_closed_en: string | null
          business_hours_closed_hi: string | null
          business_hours_closed_gu: string | null
        }
        Insert: {
          address?: string | null
          address_en?: string | null
          address_hi?: string | null
          address_gu?: string | null
          business_name?: string | null
          business_name_en?: string | null
          business_name_hi?: string | null
          business_name_gu?: string | null
          email?: string | null
          facebook?: string | null
          footer_text?: string | null
          footer_en?: string | null
          footer_hi?: string | null
          footer_gu?: string | null
          google_map?: string | null
          id: number
          instagram?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          address_en?: string | null
          address_hi?: string | null
          address_gu?: string | null
          business_name?: string | null
          business_name_en?: string | null
          business_name_hi?: string | null
          business_name_gu?: string | null
          email?: string | null
          facebook?: string | null
          footer_text?: string | null
          footer_en?: string | null
          footer_hi?: string | null
          footer_gu?: string | null
          google_map?: string | null
          id?: number
          instagram?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          customer_location: string | null
          customer_name: string
          customer_name_en: string | null
          customer_name_hi: string | null
          customer_name_gu: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          message: string
          message_en: string | null
          message_hi: string | null
          message_gu: string | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_location?: string | null
          customer_name: string
          customer_name_en?: string | null
          customer_name_hi?: string | null
          customer_name_gu?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          message: string
          message_en?: string | null
          message_hi?: string | null
          message_gu?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_location?: string | null
          customer_name?: string
          customer_name_en?: string | null
          customer_name_hi?: string | null
          customer_name_gu?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          message?: string
          message_en?: string | null
          message_hi?: string | null
          message_gu?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
