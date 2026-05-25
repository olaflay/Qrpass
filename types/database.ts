export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PassStatus = "active" | "checked_in" | "revoked"

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          organizer_id: string
          name: string
          slug: string
          venue: string | null
          starts_at: string
          ends_at: string | null
          brand_color: string | null
          logo_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          name: string
          slug: string
          venue?: string | null
          starts_at: string
          ends_at?: string | null
          brand_color?: string | null
          logo_path?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>
        Relationships: []
      }
      attendees: {
        Row: {
          id: string
          event_id: string
          full_name: string
          email: string
          ticket_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          full_name: string
          email: string
          ticket_type?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["attendees"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "attendees_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      passes: {
        Row: {
          id: string
          attendee_id: string
          event_id: string
          token_hash: string
          status: PassStatus
          checked_in_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          attendee_id: string
          event_id: string
          token_hash: string
          status?: PassStatus
          checked_in_at?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["passes"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "passes_attendee_id_fkey"
            columns: ["attendee_id"]
            referencedRelation: "attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passes_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      pass_status: PassStatus
    }
    CompositeTypes: Record<string, never>
  }
}
