export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          couple_id: string | null
          birthday: string | null
          gender: 'female' | 'male' | 'other' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          couple_id?: string | null
          birthday?: string | null
          gender?: 'female' | 'male' | 'other' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          couple_id?: string | null
          birthday?: string | null
          gender?: 'female' | 'male' | 'other' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      couples: {
        Row: {
          id: string
          invite_code: string
          anniversary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invite_code: string
          anniversary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invite_code?: string
          anniversary?: string | null
          created_at?: string
        }
        Relationships: []
      }
      check_in_templates: {
        Row: {
          id: string
          couple_id: string
          slug: string
          emoji: string
          title: string
          description: string
          points: number
          schedule: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          slug: string
          emoji?: string
          title: string
          description?: string
          points?: number
          schedule?: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          slug?: string
          emoji?: string
          title?: string
          description?: string
          points?: number
          schedule?: string
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      check_in_logs: {
        Row: {
          id: string
          couple_id: string
          user_id: string
          template_id: string
          log_date: string
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          user_id: string
          template_id: string
          log_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          user_id?: string
          template_id?: string
          log_date?: string
          created_at?: string
        }
        Relationships: []
      }
      meal_records: {
        Row: {
          id: string
          couple_id: string
          user_id: string
          photo_path: string
          caption: string
          meal_type: string
          points: number
          log_date: string
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          user_id: string
          photo_path: string
          caption?: string
          meal_type: string
          points?: number
          log_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          user_id?: string
          photo_path?: string
          caption?: string
          meal_type?: string
          points?: number
          log_date?: string
          created_at?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          id: string
          couple_id: string
          user_id: string
          amount: number
          label: string
          source_type: string
          source_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          user_id: string
          amount: number
          label: string
          source_type: string
          source_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          user_id?: string
          amount?: number
          label?: string
          source_type?: string
          source_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          couple_id: string
          emoji: string
          title: string
          description: string
          cost: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          emoji?: string
          title: string
          description?: string
          cost: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          emoji?: string
          title?: string
          description?: string
          cost?: number
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      cycle_settings: {
        Row: {
          user_id: string
          couple_id: string
          share_logs_with_partner: boolean
          share_prediction_with_partner: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          couple_id: string
          share_logs_with_partner?: boolean
          share_prediction_with_partner?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          couple_id?: string
          share_logs_with_partner?: boolean
          share_prediction_with_partner?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      cycle_periods: {
        Row: {
          id: string
          user_id: string
          couple_id: string
          start_date: string
          end_date: string | null
          note: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          couple_id: string
          start_date: string
          end_date?: string | null
          note?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          couple_id?: string
          start_date?: string
          end_date?: string | null
          note?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      create_couple: {
        Args: Record<string, never>
        Returns: Json
      }
      join_couple: {
        Args: { p_invite_code: string }
        Returns: Json
      }
      seed_couple_defaults: {
        Args: { p_couple_id: string }
        Returns: undefined
      }
      get_couple_points: {
        Args: { p_couple_id: string }
        Returns: number
      }
      complete_check_in: {
        Args: { p_slug: string }
        Returns: Json
      }
      submit_meal: {
        Args: { p_photo_path: string; p_caption: string; p_meal_type: string }
        Returns: Json
      }
      redeem_reward: {
        Args: { p_reward_id: string }
        Returns: Json
      }
      ensure_cycle_settings: {
        Args: Record<string, never>
        Returns: Database['public']['Tables']['cycle_settings']['Row']
      }
      update_cycle_privacy: {
        Args: { p_share_logs: boolean; p_share_prediction: boolean }
        Returns: Json
      }
      start_cycle_period: {
        Args: Record<string, never>
        Returns: Json
      }
      end_cycle_period: {
        Args: Record<string, never>
        Returns: Json
      }
      compute_cycle_prediction: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_partner_cycle_snapshot: {
        Args: Record<string, never>
        Returns: Json
      }
      save_cycle_period: {
        Args: {
          p_start_date: string
          p_end_date?: string | null
          p_note?: string
          p_id?: string | null
        }
        Returns: Json
      }
      delete_cycle_period: {
        Args: { p_id: string }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Couple = Database['public']['Tables']['couples']['Row']

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
