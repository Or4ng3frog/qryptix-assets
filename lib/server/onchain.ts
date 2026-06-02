import 'server-only';

// ============================================================
//  Server-side on-chain verification (never trusts the client).
//  Uses a viem public client bound to the active network and reads the
//  real USDC Transfer event from the transaction receipt.
// ============================================================

import {
  createPublicClient,
  http,
  getAddress,
  isAddress,
  zeroAddress,
  parseEventLogs,
  type Address,
} from 'viem';
import { base, baseSepolia } from 'viem/chains';

export type ChainMode = 'mainnet' | 'testnet';

export const MODE: ChainMode =
  process.env.NEXT_PUBLIC_CHAIN_MODE === 'mainnet' ? 'mainnet' : 'testnet';

const CHAIN = MODE === 'mainnet' ? base : baseSepolia;

const RPC_URL =
  MODE === 'mainnet'
    ? process.env.BASE_RPC_URL || process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
    : process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

const USDC_ADDRESS: Record<ChainMode, Address> = {
  mainnet: '0x833589fCD6EDb6E08f4c7C32D4f71b54bdA02913',
  testnet: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
};

export const ONCHAIN = {
  mode: MODE,
  chainId: CHAIN.id,
  usdc: getAddress(USDC_ADDRESS[MODE]),
  usdcDecimals: 6,
};

/** Server treasury source — prefers server-only TREASURY_WALLET, falls back to the public one. */
export function getTreasury(): { valid: boolean; address?: Address; error?: string } {
  const raw = process.env.TREASURY_WALLET || process.env.NEXT_PUBLIC_TREASURY_WALLET || '';
  if (!raw) return { valid: false, error: 'Treasury wallet is not configured (set TREASURY_WALLET).' };
  if (!isAddress(raw)) return { valid: false, error: 'Treasury wallet is not a valid EVM address.' };
  const address = getAddress(raw);
  if (address === zeroAddress) return { valid: false, error: 'Treasury wallet must not be the zero address.' };
  return { valid: true, address };
}

const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC_URL) });

const TRANSFER_EVENT = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
  },
] as const;

export type VerifyResult =
  | { ok: true; amountUnits: bigint; from: Address; to: Address; chainId: number; token: Address }
  | { ok: false; error: string };

/**
 * Verify that `txHash` is a successful USDC transfer of the correct token,
 * on the active chain, FROM `expect.from` TO `expect.to`. Returns the exact
 * on-chain amount (token units) — the only trusted source for the USD value.
 */
export async function verifyUsdcPayment(
  txHash: `0x${string}`,
  expect: { from: Address; to: Address },
): Promise<VerifyResult> {
  let receipt;
  try {
    receipt = await publicClient.getTransactionReceipt({ hash: txHash });
  } catch {
    return { ok: false, error: 'Transaction not found or not yet mined on the expected network.' };
  }

  if (receipt.status !== 'success') {
    return { ok: false, error: 'Transaction did not succeed on-chain.' };
  }

  // The public client is bound to the active chain, so a found receipt is
  // already on the correct network. Decode USDC Transfer logs.
  let logs;
  try {
    logs = parseEventLogs({ abi: TRANSFER_EVENT, logs: receipt.logs, eventName: 'Transfer' });
  } catch {
    return { ok: false, error: 'Could not decode transfer logs.' };
  }

  const usdcTransfers = logs.filter((l) => getAddress(l.address) === ONCHAIN.usdc);
  if (usdcTransfers.length === 0) {
    return { ok: false, error: 'No USDC transfer found in this transaction (wrong token?).' };
  }

  const match = usdcTransfers.find(
    (l) =>
      getAddress(l.args.from as Address) === getAddress(expect.from) &&
      getAddress(l.args.to as Address) === getAddress(expect.to),
  );
  if (!match) {
    return { ok: false, error: 'USDC transfer did not match the connected wallet → treasury.' };
  }

  return {
    ok: true,
    amountUnits: match.args.value as bigint,
    from: getAddress(match.args.from as Address),
    to: getAddress(match.args.to as Address),
    chainId: CHAIN.id,
    token: ONCHAIN.usdc,
  };
}
