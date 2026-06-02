-- ============================================================
--  QRYPTIX — Migration 0002: verified purchase flow
--  Adds the fields the server-verified purchase endpoint writes,
--  makes user_id optional (email-only purchases are allowed and
--  linked to an account by email), enforces tx_hash uniqueness,
--  and lets a signed-in user read purchases that match their email.
--
--  Run AFTER 0001_init.sql.
-- ============================================================

-- ---------- purchases: new columns ----------
alter table public.purchases
  alter column user_id drop not null;

alter table public.purchases
  add column if not exists email                   text,
  add column if not exists chain_id                integer,
  add column if not exists payment_token           text,
  add column if not exists payment_token_address   text,
  add column if not exists treasury_wallet         text,
  add column if not exists price_usd               numeric(12,6),
  add column if not exists amount_paid_token_units numeric(40,0),
  add column if not exists phase                    text,
  add column if not exists refund_eligible          boolean default false,
  add column if not exists refund_requested_at      timestamptz,
  add column if not exists refund_processed_at      timestamptz,
  add column if not exists updated_at               timestamptz default now();

-- ---------- duplicate tx protection ----------
create unique index if not exists purchases_tx_hash_unique
  on public.purchases (tx_hash)
  where tx_hash is not null;

-- Helpful lookup indexes for the caps / dedupe queries.
create index if not exists purchases_wallet_idx on public.purchases (wallet_address);
create index if not exists purchases_email_idx  on public.purchases (lower(email));
create index if not exists purchases_stage_idx  on public.purchases (presale_stage);

-- ---------- keep updated_at fresh ----------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists purchases_touch_updated_at on public.purchases;
create trigger purchases_touch_updated_at
  before update on public.purchases
  for each row execute function public.touch_updated_at();

-- ---------- RLS: let a user read purchases matching their email ----------
-- (covers email-only purchases made before/without sign-in). Inserts are done
-- by the service-role key in /api/purchase AFTER on-chain verification, so no
-- client insert policy is needed for the verified flow.
drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select using (
    auth.uid() = user_id
    or (email is not null and lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
    or public.is_admin()
  );
