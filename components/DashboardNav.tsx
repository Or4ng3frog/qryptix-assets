'use client';

import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import { Icon } from './Icon';

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: 'gauge' },
  { label: 'Transactions', href: '/dashboard/transactions', icon: 'boxes' },
  { label: 'Wallet & Claim', href: '/dashboard/wallet', icon: 'lock' },
  { label: 'Vesting', href: '/dashboard/vesting', icon: 'doc' },
  { label: 'Refund', href: '/dashboard/refund', icon: 'shield' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'cpu' },
];

export function DashboardNav() {
  const path = usePathname();

  const signOut = async () => {
    if (!SUPABASE_CONFIGURED) {
      window.location.href = '/';
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-6rem)] flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
      {NAV.map((item) => {
        const active = path === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
              active
                ? 'bg-gradient-to-r from-cyan/10 to-violet/10 border border-violet/25 text-ghost'
                : 'text-mist hover:text-ghost hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            <Icon name={item.icon} size={17} className={active ? 'text-violet-bright' : ''} />
            {item.label}
          </a>
        );
      })}
      <button
        onClick={signOut}
        className="hidden lg:flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-fog hover:text-mist transition-colors mt-auto"
      >
        <Icon name="external" size={17} />
        Sign out
      </button>
    </aside>
  );
}
