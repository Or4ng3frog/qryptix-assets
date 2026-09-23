import { createClient } from '@/lib/supabase/server';
import {
  SUPABASE_CONFIGURED,
  MOCK_PROFILE,
  MOCK_ALLOCATION,
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
      wallets: [],
      purchases: [],
      allocation: { ...MOCK_ALLOCATION, total_qtx: 0, unlocked_at_tge: 0, locked_qtx: 0 },
      refunds: [],
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

  const [profileRes, walletsRes, purchasesRes, refundsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('purchases').select('*').or(purchaseFilter).order('created_at', { ascending: false }),
    supabase.from('refund_requests').select('*').eq('user_id', user.id).order('requested_at', { ascending: false }),
  ]);

  // The purchase endpoint records verified purchases but does not update
  // token_allocations. Derive this preview of proposed vesting from the same
  // confirmed purchases shown elsewhere in the dashboard.
  const confirmedQtx = (purchasesRes.data ?? [])
    .filter((purchase) => purchase.status === 'confirmed')
    .reduce((sum, purchase) => sum + Number(purchase.qtx_amount || 0), 0);
  const allocation = {
    ...MOCK_ALLOCATION,
    user_id: user.id,
    total_qtx: confirmedQtx,
    unlocked_at_tge: confirmedQtx * 0.1,
    locked_qtx: confirmedQtx * 0.9,
  };

  return {
    profile: profileRes.data ?? { ...MOCK_PROFILE, id: user.id, email: user.email ?? null },
    wallets: walletsRes.data ?? [],
    purchases: purchasesRes.data ?? [],
    allocation,
    refunds: refundsRes.data ?? [],
    preview: false,
  };
}
