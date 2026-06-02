// ============================================================
//  Chain / network configuration for the purchase flow.
//  Client-safe: only reads NEXT_PUBLIC_* env + viem address utils.
//  The server has its own treasury/RPC source in lib/server/onchain.ts.
// ============================================================

import { base, baseSepolia } from 'wagmi/chains';
import { type Address, getAddress, isAddress, zeroAddress } from 'viem';

export type ChainMode = 'mainnet' | 'testnet';

// SAFETY: default to TESTNET whenever the flag is unset/invalid — never
// silently target mainnet.
export const CHAIN_MODE: ChainMode =
  process.env.NEXT_PUBLIC_CHAIN_MODE === 'mainnet' ? 'mainnet' : 'testnet';

export const ACTIVE_CHAIN = CHAIN_MODE === 'mainnet' ? base : baseSepolia;
export const ACTIVE_CHAIN_ID = ACTIVE_CHAIN.id; // 8453 | 84532
export const ACTIVE_CHAIN_LABEL = CHAIN_MODE === 'mainnet' ? 'Base' : 'Base Sepolia';

// USDC (6 decimals) per network. Testnet = Circle's Base Sepolia USDC.
export const USDC_BY_MODE: Record<ChainMode, { address: Address; decimals: number; chainId: number }> = {
  mainnet: { address: '0x833589fCD6EDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, chainId: base.id },
  testnet: { address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', decimals: 6, chainId: baseSepolia.id },
};
export const ACTIVE_USDC = USDC_BY_MODE[CHAIN_MODE];

// ── Treasury guard (client view) ────────────────────────────
export type TreasuryCheck = { valid: boolean; address?: Address; error?: string };

export function validateTreasury(raw: string | undefined | null): TreasuryCheck {
  if (!raw) return { valid: false, error: 'Treasury wallet is not configured.' };
  if (!isAddress(raw)) return { valid: false, error: 'Treasury wallet is not a valid EVM address.' };
  const address = getAddress(raw);
  if (address === zeroAddress) return { valid: false, error: 'Treasury wallet must not be the zero address.' };
  return { valid: true, address };
}

export const TREASURY = validateTreasury(process.env.NEXT_PUBLIC_TREASURY_WALLET);

// Live purchase requires BOTH the flag AND a valid treasury.
export const BUY_FLOW_ENABLED = process.env.NEXT_PUBLIC_BUY_FLOW_ENABLED === 'true';
export const PURCHASE_READY = BUY_FLOW_ENABLED && TREASURY.valid;
