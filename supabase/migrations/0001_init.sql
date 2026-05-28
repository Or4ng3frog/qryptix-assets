-- ============================================================
--  QRYPTIX — Database schema (Supabase / Postgres)
--  Run this in the Supabase SQL editor, or via `supabase db push`.
--
--  Covers: profiles, wallets, purchases, refund_requests,
--          presale_stages, token_allocations, audit_log
--  Includes Row Level Security so each user only sees their own data.
-- ============================================================

-- ---------- Enums ----------
do $$ begin
  create type purchase_status as enum ('pending', 'confirmed', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type refund_status as enum ('not_requested', 'requested', 'under_review', 'approved', 'rejected', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type stage_status as enum ('upcoming', 'active', 'closed');
exception when duplicate_object then null; end $$;

-- ---------- profiles ----------
-- Mirrors auth.users; created automatically on signup via trigger below.
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  jurisdiction    text,                       -- self-declared country (placeholder for future KYC)
  kyc_status      text default 'none',        -- placeholder: none | pending | verified
  is_admin        boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ---------- wallets ----------
-- A user may link one or more wallets. `is_primary` marks the allocation wallet.
create table if not exists public.wallets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  address         text not null,
  chain_id        integer default 8453,       -- Base mainnet
  is_primary      boolean default false,
  created_at      timestamptz default now(),
  unique (user_id, address)
);

-- ---------- presale_stages ----------
-- Seeded from lib/config PRESALE_STAGES. Drives current price + progress.
create table if not exists public.presale_stages (
  id              uuid primary key default gen_random_uuid(),
  stage           integer not null unique,    -- 1..5
  code            text not null,              -- 'P1'..'P5'
  price_usd       numeric(12,6) not null,
  allocation_qtx  bigint,                     -- cap for this stage (optional)
  reserved_qtx    bigint default 0,
  status          stage_status default 'upcoming',
  created_at      timestamptz default now()
);

-- ---------- purchases ----------
create table if not exists public.purchases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  wallet_address    text,
  amount_paid       numeric(20,6) not null,     -- in payment_currency units
  payment_currency  text not null,              -- 'USDC' | 'USDT' | 'ETH'
  amount_paid_usd   numeric(20,6),              -- normalized USD value at time of purchase
  qtx_amount        numeric(30,6) not null,
  presale_stage     integer references public.presale_stages(stage),
  tx_hash           text,
  status            purchase_status default 'pending',
  created_at        timestamptz default now(),
  confirmed_at      timestamptz
);

-- ---------- refund_requests ----------
create table if not exists public.refund_requests (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  purchase_id       uuid not null references public.purchases(id) on delete cascade,
  reason            text,
  status            refund_status default 'requested',
  requested_at      timestamptz default now(),
  reviewed_at       timestamptz,
  refunded_at       timestamptz,
  refund_tx_hash    text
);

-- ---------- token_allocations ----------
-- One row per user summarizing vesting. Updated as purchases confirm.
create table if not exists public.token_allocations (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade unique,
  total_qtx         numeric(30,6) default 0,
  unlocked_at_tge   numeric(30,6) default 0,   -- 10% of total (per current terms)
  locked_qtx        numeric(30,6) default 0,
  next_unlock_at    timestamptz,
  vesting_note      text default 'Planned — subject to final terms',
  updated_at        timestamptz default now()
);

-- ---------- audit_log (optional) ----------
create table if not exists public.audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references public.profiles(id) on delete set null,
  action          text not null,
  entity          text,
  entity_id       uuid,
  meta            jsonb,
  created_at      timestamptz default now()
);

-- ============================================================
--  Trigger: auto-create profile + allocation row on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  insert into public.token_allocations (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.wallets           enable row level security;
alter table public.purchases         enable row level security;
alter table public.refund_requests   enable row level security;
alter table public.token_allocations enable row level security;
alter table public.presale_stages    enable row level security;
alter table public.audit_log         enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- profiles: user reads/updates own row; admins read all
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- wallets: full CRUD on own rows
drop policy if exists "wallets_all_own" on public.wallets;
create policy "wallets_all_own" on public.wallets
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- purchases: user reads own + inserts own; admins read all + update status
drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "purchases_insert_own" on public.purchases;
create policy "purchases_insert_own" on public.purchases
  for insert with check (auth.uid() = user_id);
drop policy if exists "purchases_admin_update" on public.purchases;
create policy "purchases_admin_update" on public.purchases
  for update using (public.is_admin());

-- refund_requests: user reads/creates own; admins read + update
drop policy if exists "refunds_select_own" on public.refund_requests;
create policy "refunds_select_own" on public.refund_requests
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "refunds_insert_own" on public.refund_requests;
create policy "refunds_insert_own" on public.refund_requests
  for insert with check (auth.uid() = user_id);
drop policy if exists "refunds_admin_update" on public.refund_requests;
create policy "refunds_admin_update" on public.refund_requests
  for update using (public.is_admin());

-- token_allocations: user reads own; admins read all
drop policy if exists "alloc_select_own" on public.token_allocations;
create policy "alloc_select_own" on public.token_allocations
  for select using (auth.uid() = user_id or public.is_admin());

-- presale_stages: world-readable (public info), admin-writable
drop policy if exists "stages_select_all" on public.presale_stages;
create policy "stages_select_all" on public.presale_stages
  for select using (true);
drop policy if exists "stages_admin_write" on public.presale_stages;
create policy "stages_admin_write" on public.presale_stages
  for all using (public.is_admin()) with check (public.is_admin());

-- audit_log: admins only
drop policy if exists "audit_admin_only" on public.audit_log;
create policy "audit_admin_only" on public.audit_log
  for select using (public.is_admin());

-- ============================================================
--  Seed: presale stages (matches lib/config.ts PHASES)
-- ============================================================
insert into public.presale_stages (stage, code, price_usd, status) values
  (1, 'P1', 0.006, 'active'),
  (2, 'P2', 0.015, 'upcoming'),
  (3, 'P3', 0.030, 'upcoming'),
  (4, 'P4', 0.060, 'upcoming'),
  (5, 'P5', 0.125, 'upcoming')
on conflict (stage) do nothing;
