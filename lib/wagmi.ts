'use client';

import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Qryptix' }),
    ...(wcProjectId ? [walletConnect({ projectId: wcProjectId })] : []),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
  ssr: true,
});

// Payment token addresses on Base
export const TOKENS = {
  USDC: {
    address: (process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913') as `0x${string}`,
    decimals: 6,
  },
  USDT: {
    address: (process.env.NEXT_PUBLIC_USDT_ADDRESS || '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2') as `0x${string}`,
    decimals: 6,
  },
  ETH: {
    address: null, // native
    decimals: 18,
  },
} as const;

export const TREASURY = (process.env.NEXT_PUBLIC_TREASURY_WALLET ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Minimal ERC-20 ABI for transfers
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;
