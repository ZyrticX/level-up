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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      course_chapters: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          amount_paid: number
          course_id: string
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          discount_code: string | null
          enrolled_at: string | null
          id: string
          payment_method: string | null
          payment_status: string
          user_id: string
          updated_at: string | null
        }
        Insert: {
          amount_paid: number
          course_id: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          enrolled_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          user_id: string
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          course_id?: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          enrolled_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          user_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          course_id: string
          created_at: string | null
          file_type: string | null
          file_url: string
          folder: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          file_type?: string | null
          file_url: string
          folder?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          file_type?: string | null
          file_url?: string
          folder?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          comment: string | null
          course_id: string
          created_at: string | null
          id: string
          is_published: boolean | null
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          department: string | null
          description: string | null
          duration: string | null
          icon_category:
            | Database["public"]["Enums"]["course_icon_category"]
            | null
          icon_url: string | null
          id: string
          institution: string | null
          instructor: string | null
          is_published: boolean | null
          price: number | null
          rating: number | null
          students_count: number | null
          students_enrolled: number | null
          title: string
          total_duration: number | null
          updated_at: string | null
          whatsapp_link: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          duration?: string | null
          icon_category?:
            | Database["public"]["Enums"]["course_icon_category"]
            | null
          icon_url?: string | null
          id?: string
          institution?: string | null
          instructor?: string | null
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          students_count?: number | null
          students_enrolled?: number | null
          title: string
          total_duration?: number | null
          updated_at?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          duration?: string | null
          icon_category?:
            | Database["public"]["Enums"]["course_icon_category"]
            | null
          icon_url?: string | null
          id?: string
          institution?: string | null
          instructor?: string | null
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          students_count?: number | null
          students_enrolled?: number | null
          title?: string
          total_duration?: number | null
          updated_at?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          institution_id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          applicable_courses: string[] | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          applicable_courses?: string[] | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          applicable_courses?: string[] | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          enrollment_id: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          payment_provider: string
          provider_payment_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          enrollment_id?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_provider: string
          provider_payment_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          enrollment_id?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_provider?: string
          provider_payment_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          additional_info: string | null
          created_at: string
          department: string | null
          first_name: string
          id: string
          institution: string | null
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          created_at?: string
          department?: string | null
          first_name: string
          id: string
          institution?: string | null
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          created_at?: string
          department?: string | null
          first_name?: string
          id?: string
          institution?: string | null
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subject_icons: {
        Row: {
          category_key: string
          category_label: string
          created_at: string | null
          custom_icon_url: string | null
          icon_type: string
          id: string
          lucide_icon_name: string | null
          updated_at: string | null
        }
        Insert: {
          category_key: string
          category_label: string
          created_at?: string | null
          custom_icon_url?: string | null
          icon_type?: string
          id?: string
          lucide_icon_name?: string | null
          updated_at?: string | null
        }
        Update: {
          category_key?: string
          category_label?: string
          created_at?: string | null
          custom_icon_url?: string | null
          icon_type?: string
          id?: string
          lucide_icon_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_given: boolean
          consent_type: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          consent_given?: boolean
          consent_type: string
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          consent_given?: boolean
          consent_type?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      video_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_watched_at: string | null
          user_id: string
          video_id: string
          watched_duration: number
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          user_id: string
          video_id: string
          watched_duration?: number
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          user_id?: string
          video_id?: string
          watched_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          chapter_id: string | null
          course_id: string
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_published: boolean | null
          is_preview: boolean | null
          order_index: number
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          hetzner_path: string | null
          hls_path: string | null
        }
        Insert: {
          chapter_id?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_published?: boolean | null
          is_preview?: boolean | null
          order_index?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          hetzner_path?: string | null
          hls_path?: string | null
        }
        Update: {
          chapter_id?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_published?: boolean | null
          is_preview?: boolean | null
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          hetzner_path?: string | null
          hls_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "course_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_has_access: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      get_course_progress: {
        Args: { _course_id: string; _user_id: string }
        Returns: number
      }
      get_enrollment_id: {
        Args: { _course_id: string; _payment_status?: string; _user_id: string }
        Returns: string
      }
      get_user_courses_with_progress: {
        Args: { _user_id: string }
        Returns: {
          completed_videos: number
          course_id: string
          course_title: string
          enrolled_at: string
          progress_percentage: number
          total_videos: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_discount_code_uses: {
        Args: { _code: string }
        Returns: undefined
      }
      update_course_statistics: {
        Args: { _course_id: string }
        Returns: undefined
      }
      validate_discount_code: {
        Args: { _code: string; _course_id: string; _purchase_amount: number }
        Returns: {
          discount_amount: number
          error_message: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      course_icon_category:
        | "electrical_engineering"
        | "digital_systems"
        | "computer_organization"
        | "computer_networks"
        | "electronics"
        | "semiconductors"
        | "signal_processing"
        | "mathematics"
        | "probability"
        | "stochastic_models"
        | "physics"
        | "mechanics"
        | "magnetism"
        | "general"
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
      course_icon_category: [
        "electrical_engineering",
        "digital_systems",
        "computer_organization",
        "computer_networks",
        "electronics",
        "semiconductors",
        "signal_processing",
        "mathematics",
        "probability",
        "stochastic_models",
        "physics",
        "mechanics",
        "magnetism",
        "general",
      ],
    },
  },
} as const
