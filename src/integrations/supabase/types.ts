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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          college_id: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_name: string | null
          category: string
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          published_date: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          category: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          published_date?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          category?: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          published_date?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      brochure_requests: {
        Row: {
          college_id: string | null
          college_name: string | null
          created_at: string
          id: string
          name: string | null
          phone: string
          source: string | null
        }
        Insert: {
          college_id?: string | null
          college_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone: string
          source?: string | null
        }
        Update: {
          college_id?: string | null
          college_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brochure_requests_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          accreditations: string[] | null
          admission_open: boolean | null
          apply_link: string | null
          brochure_link: string | null
          cat_cutoff: number | null
          created_at: string
          degree: string | null
          description: string | null
          duration: string | null
          featured: boolean | null
          fees_max: number | null
          fees_min: number | null
          hostel: boolean | null
          id: string
          image_url: string | null
          location: string
          logo_color: string | null
          name: string
          placement_avg: number | null
          placement_high: number | null
          placement_pct: number | null
          rating: number | null
          scholarship: boolean | null
          short_name: string | null
          sponsored: boolean | null
          tags: string[] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          accreditations?: string[] | null
          admission_open?: boolean | null
          apply_link?: string | null
          brochure_link?: string | null
          cat_cutoff?: number | null
          created_at?: string
          degree?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          fees_max?: number | null
          fees_min?: number | null
          hostel?: boolean | null
          id?: string
          image_url?: string | null
          location: string
          logo_color?: string | null
          name: string
          placement_avg?: number | null
          placement_high?: number | null
          placement_pct?: number | null
          rating?: number | null
          scholarship?: boolean | null
          short_name?: string | null
          sponsored?: boolean | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          accreditations?: string[] | null
          admission_open?: boolean | null
          apply_link?: string | null
          brochure_link?: string | null
          cat_cutoff?: number | null
          created_at?: string
          degree?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          fees_max?: number | null
          fees_min?: number | null
          hostel?: boolean | null
          id?: string
          image_url?: string | null
          location?: string
          logo_color?: string | null
          name?: string
          placement_avg?: number | null
          placement_high?: number | null
          placement_pct?: number | null
          rating?: number | null
          scholarship?: boolean | null
          short_name?: string | null
          sponsored?: boolean | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      counselling_leads: {
        Row: {
          budget: string | null
          city: string | null
          created_at: string
          degree: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string
          status: string | null
        }
        Insert: {
          budget?: string | null
          city?: string | null
          created_at?: string
          degree?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          status?: string | null
        }
        Update: {
          budget?: string | null
          city?: string | null
          created_at?: string
          degree?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      lead_magnet_downloads: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          magnet_slug: string
          name: string | null
          phone: string | null
          source: string | null
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          magnet_slug: string
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          magnet_slug?: string
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      loan_leads: {
        Row: {
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          loan_amount: string | null
          mobile: string
          preferred_bank: string | null
          preferred_college: string | null
          qualification: string | null
          status: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          loan_amount?: string | null
          mobile: string
          preferred_bank?: string | null
          preferred_college?: string | null
          qualification?: string | null
          status?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          loan_amount?: string | null
          mobile?: string
          preferred_bank?: string | null
          preferred_college?: string | null
          qualification?: string | null
          status?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          category: string
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_date: string
          slug: string
          source_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_date?: string
          slug: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_date?: string
          slug?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          target_degree: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          target_degree?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          target_degree?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_colleges: {
        Row: {
          college_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_colleges_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "student"
      application_status:
        | "submitted"
        | "under_review"
        | "accepted"
        | "rejected"
        | "waitlisted"
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
      app_role: ["admin", "student"],
      application_status: [
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "waitlisted",
      ],
    },
  },
} as const
