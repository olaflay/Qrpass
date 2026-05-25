-- ====================================================================
-- QRPass - Supabase PostgreSQL Database Schema and Indexing Strategy
-- ====================================================================
-- This SQL script initializes the core database tables for QRPass
-- and defines crucial database indexes to optimize query performance when
-- accessing the website and verifying attendee passes.
-- ====================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Drop Tables (For clean initialization)
-- ==========================================
DROP TABLE IF EXISTS public.passes CASCADE;
DROP TABLE IF EXISTS public.attendees CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TYPE IF EXISTS public.pass_status CASCADE;

-- ==========================================
-- 2. Custom Types & Enums
-- ==========================================
CREATE TYPE public.pass_status AS ENUM ('active', 'checked_in', 'revoked');

-- ==========================================
-- 3. Core Database Tables
-- ==========================================

-- 3.1. Events Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL, -- references auth.users(id) in Supabase
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    venue TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    brand_color TEXT DEFAULT '#162033',
    logo_path TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure event slug is unique per organizer
    CONSTRAINT unique_organizer_event_slug UNIQUE (organizer_id, slug)
);

-- 3.2. Attendees Table
CREATE TABLE public.attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    ticket_type TEXT DEFAULT 'General Admission',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Avoid duplicate guest emails for the same event
    CONSTRAINT unique_event_attendee_email UNIQUE (event_id, email)
);

-- 3.3. Passes Table
CREATE TABLE public.passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    status public.pass_status DEFAULT 'active'::public.pass_status NOT NULL,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure an attendee has only one pass per event
    CONSTRAINT unique_event_attendee_pass UNIQUE (event_id, attendee_id)
);

-- ==========================================
-- 4. High-Performance Database Indexes
-- ==========================================

-- 4.1. Events Indexes
-- Speeds up listing events for the dashboard, sorting by the start date
CREATE INDEX IF NOT EXISTS idx_events_organizer_starts_at 
ON public.events (organizer_id, starts_at DESC);

-- Speeds up public event lookup by slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug_lookup 
ON public.events (slug);


-- 4.2. Attendees Indexes
-- Speeds up loading the attendee list for a specific event
CREATE INDEX IF NOT EXISTS idx_attendees_event_id 
ON public.attendees (event_id);

-- Speeds up guest search/lookup by email within an event
CREATE INDEX IF NOT EXISTS idx_attendees_event_email 
ON public.attendees (event_id, email);

-- Speeds up guest list sorting/search by full name within an event
CREATE INDEX IF NOT EXISTS idx_attendees_event_name 
ON public.attendees (event_id, full_name);


-- 4.3. Passes & Verification Indexes
-- CRITICAL INDEX: Ensures lightning-fast QR code verification lookups
-- Every QR scan checks this token_hash. Needs to be O(1) speed.
CREATE UNIQUE INDEX IF NOT EXISTS idx_passes_token_hash 
ON public.passes (token_hash);

-- Speeds up verifying the relationship between attendee and pass
CREATE INDEX IF NOT EXISTS idx_passes_attendee_id 
ON public.passes (attendee_id);

-- Speeds up listing passes by their active/checked-in status for an event (e.g. analytics, check-in sheets)
CREATE INDEX IF NOT EXISTS idx_passes_event_id_status 
ON public.passes (event_id, status);


-- ==========================================
-- 5. Row Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;

-- 5.1. Events Policies
CREATE POLICY "Organizers can manage their own events" 
ON public.events 
FOR ALL 
TO authenticated 
USING (auth.uid() = organizer_id) 
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Anyone can view public event details" 
ON public.events 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 5.2. Attendees Policies
CREATE POLICY "Organizers can manage attendees of their events" 
ON public.attendees 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE events.id = attendees.event_id AND events.organizer_id = auth.uid()
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE events.id = attendees.event_id AND events.organizer_id = auth.uid()
    )
);

-- 5.3. Passes Policies
CREATE POLICY "Organizers can manage passes of their events" 
ON public.passes 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE events.id = passes.event_id AND events.organizer_id = auth.uid()
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE events.id = passes.event_id AND events.organizer_id = auth.uid()
    )
);

CREATE POLICY "Anyone can look up a pass for verification" 
ON public.passes 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Anyone can update a pass's check-in status (via verification)" 
ON public.passes 
FOR UPDATE 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- ==========================================
-- 6. Secure Check-In RPC Function
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_in_attendee(
    p_token_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass direct update RLS constraints if needed
AS $$
DECLARE
    v_pass RECORD;
    v_attendee RECORD;
    v_event RECORD;
BEGIN
    -- 1. Look up the pass by token_hash
    SELECT * INTO v_pass FROM public.passes WHERE token_hash = p_token_hash;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pass not found or invalid QR code.');
    END IF;
    
    -- 2. Look up attendee and event details
    SELECT * INTO v_attendee FROM public.attendees WHERE id = v_pass.attendee_id;
    SELECT * INTO v_event FROM public.events WHERE id = v_pass.event_id;
    
    -- 3. Check pass status
    IF v_pass.status = 'checked_in' THEN
        RETURN jsonb_build_object(
            'success', false, 
            'already_checked_in', true,
            'message', 'Pass has already been used.',
            'attendee_name', v_attendee.full_name,
            'ticket_type', v_attendee.ticket_type,
            'event_name', v_event.name,
            'checked_in_at', v_pass.checked_in_at
        );
    ELSIF v_pass.status = 'revoked' THEN
        RETURN jsonb_build_object('success', false, 'message', 'This pass has been revoked.');
    END IF;
    
    -- 4. Mark pass as checked in
    UPDATE public.passes
    SET status = 'checked_in',
        checked_in_at = timezone('utc'::text, now())
    WHERE id = v_pass.id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Check-in successful!',
        'attendee_name', v_attendee.full_name,
        'ticket_type', v_attendee.ticket_type,
        'event_name', v_event.name,
        'checked_in_at', timezone('utc'::text, now())
    );
END;
$$;

