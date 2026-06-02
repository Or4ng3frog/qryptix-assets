import { createClient } from '@/lib/supabase/server';
import {
  SUPABASE_CONFIGURED,
  MOCK_PROFILE,
  MOCK_WALLET,
  MOCK_PURCHASES,
  MOCK_ALLOCATION,
  MOCK_REFUNDS,
} from '@/lib/data';
import type { Profile, Wallet, Purchase, RefundRequest, TokenAllocation } from '@/lib/supabase/types';

export type DashboardData = {
  profile: Profile;
  wallets: Wallet[];
  purchases: Purchase[];
  allocation: TokenAllocation;
  refunds: RefundRequest[];
  preview: boolean;
};

export async function getDashboardData(): Promise<DashboardData | null> {
  // Preview mode — no Supabase configured
  if (!SUPABASE_CONFIGURED) {
    return {
      profile: MOCK_PROFILE,
      wallets: [MOCK_WALLET],
      purchases: MOCK_PURCHASES,
      allocation: MOCK_ALLOCATION,
      refunds: MOCK_REFUNDS,
      preview: true,
    };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Purchases may be linked by user_id OR by email (verified email-only
  // purchases). RLS still restricts rows to this user / their email.
  const purchaseFilter = user.email
    ? `user_id.eq.${user.id},email.eq.${user.email.toLowerCase()}`
    : `user_id.eq.${user.id}`;

  const [profileRes, walletsRes, purchasesRes, allocRes, refundsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('purchases').select('*').or(purchaseFilter).order('created_at', { ascending: false }),
    supabase.from('token_allocations').select('*').eq('user_id', user.id).single(),
    supabase.from('refund_requests').select('*').eq('user_id', user.id).order('requested_at', { ascending: false }),
  ]);

  return {
    profile: profileRes.data ?? { ...MOCK_PROFILE, id: user.id, email: user.email ?? null },
    wallets: walletsRes.data ?? [],
    purchases: purchasesRes.data ?? [],
    allocation: allocRes.data ?? { ...MOCK_ALLOCATION, user_id: user.id, total_qtx: 0, unlocked_at_tge: 0, locked_qtx: 0 },
    refunds: refundsRes.data ?? [],
    preview: false,
  };
}
