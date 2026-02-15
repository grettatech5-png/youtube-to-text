export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          user_id: string
          balance: number
          granted_once: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          balance?: number
          granted_once?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          balance?: number
          granted_once?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      summaries: {
        Row: {
          id: number
          user_id: string
          source_url: string
          summary_text: string
          credits_spent: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          source_url: string
          summary_text: string
          credits_spent?: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          source_url?: string
          summary_text?: string
          credits_spent?: number
          created_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: number
          user_id: string
          delta: number
          reason: "welcome_bonus" | "summary_generation"
          meta: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          delta: number
          reason: "welcome_bonus" | "summary_generation"
          meta?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          delta?: number
          reason?: "welcome_bonus" | "summary_generation"
          meta?: Record<string, unknown>
          created_at?: string
        }
      }
    }
    Functions: {
      bootstrap_user_credits: {
        Args: { p_user_id?: string }
        Returns: { balance: number; granted: boolean }[]
      }
      consume_credit_and_store_summary: {
        Args: {
          p_user_id?: string
          p_source_url?: string
          p_summary_text?: string
        }
        Returns: { summary_id: number; remaining_credits: number }[]
      }
    }
  }
}

