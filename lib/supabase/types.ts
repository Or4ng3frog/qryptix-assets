// Generated-style types for the Qryptix schema.
// You can regenerate with: supabase gen types typescript --local > lib/supabase/types.ts

export type PurchaseStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';
export type RefundStatus =
  | 'not_requested'
  | 'requested'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'paid';
export type StageStatus = 'upcoming' | 'active' | 'closed';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  jurisdiction: string | null;
  kyc_status: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  address: string;
  chain_id: number;
  is_primary: boolean;
  created_at: string;
}

export interface PresaleStage {
  id: string;
  stage: number;
  code: string;
  price_usd: number;
  allocation_qtx: number | null;
  reserved_qtx: number;
  status: StageStatus;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string | null;
  email: string | null;
  wallet_address: string | null;
  chain_id: number | null;
  amount_paid: number;
  payment_currency: string;
  payment_token: string | null;
  payment_token_address: string | null;
  treasury_wallet: string | null;
  amount_paid_usd: number | null;
  amount_paid_token_units: string | null;
  qtx_amount: number;
  presale_stage: number | null;
  phase: string | null;
  price_usd: number | null;
  tx_hash: string | null;
  status: PurchaseStatus;
  refund_eligible: boolean | null;
  refund_requested_at: string | null;
  refund_processed_at: string | null;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string | null;
}

export interface RefundRequest {
  id: string;
  user_id: string;
  purchase_id: string;
  reason: string | null;
  status: RefundStatus;
  requested_at: string;
  reviewed_at: string | null;
  refunded_at: string | null;
  refund_tx_hash: string | null;
}

export interface TokenAllocation {
  id: string;
  user_id: string;
  total_qtx: number;
  unlocked_at_tge: number;
  locked_qtx: number;
  next_unlock_at: string | null;
  vesting_note: string;
  updated_at: string;
}
