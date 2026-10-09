import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase Substrate (L1 Layer)
 * Canonical client for database, auth, and storage operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'ADMIN' | 'MARKETER' | 'VIEWER';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    subscription_tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
    organization_id?: string;
}
