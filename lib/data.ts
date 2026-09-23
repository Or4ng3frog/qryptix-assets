import type { Profile, TokenAllocation } from './supabase/types';

export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Empty preview state, used only when Supabase is not configured.
export const MOCK_PROFILE: Profile = {
  id: 'preview-user',
  email: null,
  full_name: null,
  jurisdiction: null,
  kyc_status: 'none',
  is_admin: false,
  created_at: '',
  updated_at: '',
};

export const MOCK_ALLOCATION: TokenAllocation = {
  id: 'preview-allocation',
  user_id: 'preview-user',
  total_qtx: 0,
  unlocked_at_tge: 0,
  locked_qtx: 0,
  next_unlock_at: null,
  vesting_note: 'Proposed: 10% at TGE, 90% linear over 8 months. Final terms pending.',
  updated_at: '',
};
