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
      activity_feed: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string
          device_id: string
          display_name: string
          emoji: string
          event_type: string
          id: string
          metadata: Json
          points: number
          title: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string
          device_id: string
          display_name?: string
          emoji?: string
          event_type?: string
          id?: string
          metadata?: Json
          points?: number
          title: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string
          device_id?: string
          display_name?: string
          emoji?: string
          event_type?: string
          id?: string
          metadata?: Json
          points?: number
          title?: string
        }
        Relationships: []
      }
      activity_reactions: {
        Row: {
          activity_id: string
          created_at: string
          device_id: string
          id: string
          reaction: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          device_id: string
          id?: string
          reaction?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          device_id?: string
          id?: string
          reaction?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_reactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_contributions: {
        Row: {
          amount: number
          challenge_id: string
          created_at: string
          device_id: string
          id: string
          quest_title: string
        }
        Insert: {
          amount?: number
          challenge_id: string
          created_at?: string
          device_id: string
          id?: string
          quest_title?: string
        }
        Update: {
          amount?: number
          challenge_id?: string
          created_at?: string
          device_id?: string
          id?: string
          quest_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_contributions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          emoji: string
          hero_count: number
          id: string
          name: string
          total_points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          hero_count?: number
          id?: string
          name: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          emoji?: string
          hero_count?: number
          id?: string
          name?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      community_challenges: {
        Row: {
          created_at: string
          description: string
          emoji: string
          ends_at: string
          goal_current: number
          goal_target: number
          goal_type: string
          id: string
          participant_count: number
          reward_badge: string | null
          reward_points: number
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          emoji?: string
          ends_at: string
          goal_current?: number
          goal_target?: number
          goal_type?: string
          id?: string
          participant_count?: number
          reward_badge?: string | null
          reward_points?: number
          starts_at?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string
          ends_at?: string
          goal_current?: number
          goal_target?: number
          goal_type?: string
          id?: string
          participant_count?: number
          reward_badge?: string | null
          reward_points?: number
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_guides: {
        Row: {
          avatar_seed: number
          backstory: string
          created_at: string
          emoji: string
          favorite_quest_type: string
          hero_points: number
          id: number
          impact_neighbors: number
          impact_quests: number
          impact_trees: number
          motto: string
          name: string
          personality_trait: string
          specialty: string
          tone: string
        }
        Insert: {
          avatar_seed?: number
          backstory?: string
          created_at?: string
          emoji?: string
          favorite_quest_type?: string
          hero_points?: number
          id?: number
          impact_neighbors?: number
          impact_quests?: number
          impact_trees?: number
          motto?: string
          name: string
          personality_trait: string
          specialty: string
          tone?: string
        }
        Update: {
          avatar_seed?: number
          backstory?: string
          created_at?: string
          emoji?: string
          favorite_quest_type?: string
          hero_points?: number
          id?: number
          impact_neighbors?: number
          impact_quests?: number
          impact_trees?: number
          motto?: string
          name?: string
          personality_trait?: string
          specialty?: string
          tone?: string
        }
        Relationships: []
      }
      completed_quests: {
        Row: {
          completed_at: string
          device_id: string
          id: string
          points_awarded: number
          quest_category: string
          quest_emoji: string
          quest_title: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          device_id: string
          id?: string
          points_awarded?: number
          quest_category?: string
          quest_emoji?: string
          quest_title: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          device_id?: string
          id?: string
          points_awarded?: number
          quest_category?: string
          quest_emoji?: string
          quest_title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string
          device_id: string
          emoji: string
          id: string
          impact_type: string | null
          impact_value: number | null
          points: number
          quest_date: string
          title: string
        }
        Insert: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string
          device_id: string
          emoji?: string
          id?: string
          impact_type?: string | null
          impact_value?: number | null
          points?: number
          quest_date?: string
          title: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string
          device_id?: string
          emoji?: string
          id?: string
          impact_type?: string | null
          impact_value?: number | null
          points?: number
          quest_date?: string
          title?: string
        }
        Relationships: []
      }
      discovery_drop_claims: {
        Row: {
          claimed_at: string
          device_id: string
          drop_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          claimed_at?: string
          device_id: string
          drop_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          claimed_at?: string
          device_id?: string
          drop_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_drop_claims_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "discovery_drops"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_drops: {
        Row: {
          created_at: string
          creator_user_id: string | null
          current_claims: number
          description: string
          ends_at: string
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          max_claims: number
          rarity: string
          reward_type: string
          reward_value: number
          sponsor_logo: string | null
          sponsor_name: string | null
          sponsor_reward_description: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_user_id?: string | null
          current_claims?: number
          description?: string
          ends_at: string
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          max_claims?: number
          rarity?: string
          reward_type?: string
          reward_value?: number
          sponsor_logo?: string | null
          sponsor_name?: string | null
          sponsor_reward_description?: string | null
          starts_at?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_user_id?: string | null
          current_claims?: number
          description?: string
          ends_at?: string
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          max_claims?: number
          rarity?: string
          reward_type?: string
          reward_value?: number
          sponsor_logo?: string | null
          sponsor_name?: string | null
          sponsor_reward_description?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      founder_badges: {
        Row: {
          badge_type: string
          device_id: string
          id: string
          metadata: Json
          minted_at: string
          tier: string
        }
        Insert: {
          badge_type: string
          device_id: string
          id?: string
          metadata?: Json
          minted_at?: string
          tier?: string
        }
        Update: {
          badge_type?: string
          device_id?: string
          id?: string
          metadata?: Json
          minted_at?: string
          tier?: string
        }
        Relationships: []
      }
      guide_conversations: {
        Row: {
          created_at: string
          device_id: string
          guide_id: number
          id: string
          messages: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_id: string
          guide_id: number
          id?: string
          messages?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_id?: string
          guide_id?: number
          id?: string
          messages?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_conversations_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "community_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_points: {
        Row: {
          amount: number
          created_at: string
          device_id: string
          id: string
          quest_id: string | null
          reason: string
        }
        Insert: {
          amount: number
          created_at?: string
          device_id: string
          id?: string
          quest_id?: string | null
          reason: string
        }
        Update: {
          amount?: number
          created_at?: string
          device_id?: string
          id?: string
          quest_id?: string | null
          reason?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      nft_drops: {
        Row: {
          chain_contract_address: string | null
          chain_network: string
          chain_token_id: string | null
          chain_tx_hash: string | null
          claimed_at: string | null
          claimer_device_id: string | null
          content_encrypted: string
          created_at: string
          creator_device_id: string
          description: string
          drop_type: string
          expires_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nft_metadata: Json | null
          qr_code: string | null
          status: string
          title: string
          token_amount: number
          updated_at: string
        }
        Insert: {
          chain_contract_address?: string | null
          chain_network?: string
          chain_token_id?: string | null
          chain_tx_hash?: string | null
          claimed_at?: string | null
          claimer_device_id?: string | null
          content_encrypted?: string
          created_at?: string
          creator_device_id: string
          description?: string
          drop_type?: string
          expires_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nft_metadata?: Json | null
          qr_code?: string | null
          status?: string
          title: string
          token_amount?: number
          updated_at?: string
        }
        Update: {
          chain_contract_address?: string | null
          chain_network?: string
          chain_token_id?: string | null
          chain_tx_hash?: string | null
          claimed_at?: string | null
          claimer_device_id?: string | null
          content_encrypted?: string
          created_at?: string
          creator_device_id?: string
          description?: string
          drop_type?: string
          expires_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nft_metadata?: Json | null
          qr_code?: string | null
          status?: string
          title?: string
          token_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          achievements: boolean
          auth: string
          community_updates: boolean
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          quest_reminders: boolean
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          achievements?: boolean
          auth: string
          community_updates?: boolean
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          quest_reminders?: boolean
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          achievements?: boolean
          auth?: string
          community_updates?: boolean
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          quest_reminders?: boolean
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          badge_unlocked: boolean
          created_at: string
          id: string
          points_awarded: boolean
          referral_code: string
          referred_device_id: string
          referrer_device_id: string
        }
        Insert: {
          badge_unlocked?: boolean
          created_at?: string
          id?: string
          points_awarded?: boolean
          referral_code: string
          referred_device_id: string
          referrer_device_id: string
        }
        Update: {
          badge_unlocked?: boolean
          created_at?: string
          id?: string
          points_awarded?: boolean
          referral_code?: string
          referred_device_id?: string
          referrer_device_id?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          student_count: number
          total_points: number
          updated_at: string
        }
        Insert: {
          city?: string
          created_at?: string
          id?: string
          name: string
          student_count?: number
          total_points?: number
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          student_count?: number
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_tasks: {
        Row: {
          completed_at: string
          device_id: string
          id: string
          platform: string
          points_awarded: number
          proof_url: string | null
          task_id: string
          task_type: string
        }
        Insert: {
          completed_at?: string
          device_id: string
          id?: string
          platform: string
          points_awarded?: number
          proof_url?: string | null
          task_id: string
          task_type: string
        }
        Update: {
          completed_at?: string
          device_id?: string
          id?: string
          platform?: string
          points_awarded?: number
          proof_url?: string | null
          task_id?: string
          task_type?: string
        }
        Relationships: []
      }
      storm_claims: {
        Row: {
          claimed_at: string
          device_id: string
          drop_id: string
          id: string
          reward_value: number
        }
        Insert: {
          claimed_at?: string
          device_id: string
          drop_id: string
          id?: string
          reward_value?: number
        }
        Update: {
          claimed_at?: string
          device_id?: string
          drop_id?: string
          id?: string
          reward_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "storm_claims_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "storm_drops"
            referencedColumns: ["id"]
          },
        ]
      }
      storm_drops: {
        Row: {
          claimed: boolean
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          id: string
          lat: number
          lng: number
          rarity: string
          reward_value: number
          storm_id: string
        }
        Insert: {
          claimed?: boolean
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: string
          lat: number
          lng: number
          rarity?: string
          reward_value?: number
          storm_id: string
        }
        Update: {
          claimed?: boolean
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          rarity?: string
          reward_value?: number
          storm_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storm_drops_storm_id_fkey"
            columns: ["storm_id"]
            isOneToOne: false
            referencedRelation: "storms"
            referencedColumns: ["id"]
          },
        ]
      }
      storms: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string
          created_by: string | null
          end_time: string
          id: string
          name: string
          radius: number
          start_time: string
          status: string
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string
          created_by?: string | null
          end_time: string
          id?: string
          name?: string
          radius?: number
          start_time?: string
          status?: string
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string
          created_by?: string | null
          end_time?: string
          id?: string
          name?: string
          radius?: number
          start_time?: string
          status?: string
        }
        Relationships: []
      }
      streak_notifications: {
        Row: {
          created_at: string
          device_id: string
          id: string
          message: string
          read: boolean
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          message: string
          read?: boolean
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          message?: string
          read?: boolean
        }
        Relationships: []
      }
      treegens: {
        Row: {
          chain_token_id: string | null
          chain_tx_hash: string | null
          created_at: string
          device_id: string
          id: string
          name: string
          rarity: string
          species: string
          stage: number
          traits: Json
          updated_at: string
          visual_seed: number
          xp: number
          xp_next_level: number
        }
        Insert: {
          chain_token_id?: string | null
          chain_tx_hash?: string | null
          created_at?: string
          device_id: string
          id?: string
          name?: string
          rarity?: string
          species?: string
          stage?: number
          traits?: Json
          updated_at?: string
          visual_seed?: number
          xp?: number
          xp_next_level?: number
        }
        Update: {
          chain_token_id?: string | null
          chain_tx_hash?: string | null
          created_at?: string
          device_id?: string
          id?: string
          name?: string
          rarity?: string
          species?: string
          stage?: number
          traits?: Json
          updated_at?: string
          visual_seed?: number
          xp?: number
          xp_next_level?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          businesses_supported: number | null
          created_at: string
          device_id: string
          display_name: string | null
          email: string | null
          email_verified: boolean | null
          hero_pledge_signed: boolean | null
          hero_pledge_signed_at: string | null
          id: string
          last_active_date: string | null
          level: number | null
          location: string | null
          miles_biked: number | null
          neighbors_helped: number | null
          onboarding_completed: boolean | null
          profile_quest_step: number | null
          quests_completed: number | null
          referral_code: string | null
          referral_count: number | null
          session_start: string | null
          socials: Json | null
          streak: number | null
          total_points: number | null
          trees_planted: number | null
          trust_score: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          businesses_supported?: number | null
          created_at?: string
          device_id: string
          display_name?: string | null
          email?: string | null
          email_verified?: boolean | null
          hero_pledge_signed?: boolean | null
          hero_pledge_signed_at?: string | null
          id?: string
          last_active_date?: string | null
          level?: number | null
          location?: string | null
          miles_biked?: number | null
          neighbors_helped?: number | null
          onboarding_completed?: boolean | null
          profile_quest_step?: number | null
          quests_completed?: number | null
          referral_code?: string | null
          referral_count?: number | null
          session_start?: string | null
          socials?: Json | null
          streak?: number | null
          total_points?: number | null
          trees_planted?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          businesses_supported?: number | null
          created_at?: string
          device_id?: string
          display_name?: string | null
          email?: string | null
          email_verified?: boolean | null
          hero_pledge_signed?: boolean | null
          hero_pledge_signed_at?: string | null
          id?: string
          last_active_date?: string | null
          level?: number | null
          location?: string | null
          miles_biked?: number | null
          neighbors_helped?: number | null
          onboarding_completed?: boolean | null
          profile_quest_step?: number | null
          quests_completed?: number | null
          referral_code?: string | null
          referral_count?: number | null
          session_start?: string | null
          socials?: Json | null
          streak?: number | null
          total_points?: number | null
          trees_planted?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      calculate_level: { Args: { points: number }; Returns: number }
      contribute_to_challenge: {
        Args: {
          _amount: number
          _challenge_id: string
          _device_id: string
          _quest_title: string
        }
        Returns: boolean
      }
      distribute_challenge_rewards: {
        Args: { _challenge_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
