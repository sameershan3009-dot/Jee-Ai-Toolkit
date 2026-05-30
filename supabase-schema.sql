create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  payment_id text unique,
  guest_id text not null,
  pack_id text not null,
  amount integer not null,
  currency text not null default 'INR',
  credits integer not null,
  status text not null check (status in ('created', 'verified', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  guest_id text not null,
  payment_id text unique,
  order_id text not null,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists payment_records_guest_id_idx on public.payment_records (guest_id);
create index if not exists credit_ledger_guest_id_idx on public.credit_ledger (guest_id);
