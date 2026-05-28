import type {
  Profile,
  Wallet,
  Purchase,
  RefundRequest,
  TokenAllocation,
} from './supabase/types';

export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ------------------------------------------------------------------
//  Mock data — used only when Supabase env vars are absent, so the
//  dashboard renders in local preview. Real data replaces this once
//  NEXT_PUBLIC_SUPABASE_URL is set.
// ------------------------------------------------------------------

export const MOCK_PROFILE: Profile = {
  id: 'preview-user',
  email: 'supporter@example.com',
  full_name: 'Preview Supporter',
  jurisdiction: 'DE',
  kyc_status: 'none',
  is_admin: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_WALLET: Wallet = {
  id: 'w1',
  user_id: 'preview-user',
  address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  chain_id: 8453,
  is_primary: true,
  created_at: new Date().toISOString(),
};

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: 'p1',
    user_id: 'preview-user',
    wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    amount_paid: 500,
    payment_currency: 'USDC',
    amount_paid_usd: 500,
    qtx_amount: 83333.33,
    presale_stage: 1,
    tx_hash: '0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    confirmed_at: new Date(Date.now() - 86400000 * 3 + 600000).toISOString(),
  },
  {
    id: 'p2',
    user_id: 'preview-user',
    wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    amount_paid: 250,
    payment_currency: 'USDT',
    amount_paid_usd: 250,
    qtx_amount: 41666.67,
    presale_stage: 1,
    tx_hash: null,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    confirmed_at: null,
  },
];

export const MOCK_ALLOCATION: TokenAllocation = {
  id: 'a1',
  user_id: 'preview-user',
  total_qtx: 125000,
  unlocked_at_tge: 12500,
  locked_qtx: 112500,
  next_unlock_at: null,
  vesting_note: 'Planned — subject to final terms. 10% at TGE, 90% linear over 8 months.',
  updated_at: new Date().toISOString(),
};

export const MOCK_REFUNDS: RefundRequest[] = [];
