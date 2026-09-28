-- =============================================================================
--  005 — orders and payments (PayMongo)
--
--  Run after 004. Safe to re-run.
--
--  WHO CAN SEE WHAT
--    fx_rates      public read — the storefront prints prices with it
--    orders,       NO public access at all. Only the Edge Functions touch them,
--    order_items,  using the service role on the server. A customer sees their
--    payment_events own order through the order-status function, which needs
--                  the order id AND its random access token.
--
--  MONEY IS STORED IN CENTAVOS (integer), never as a float: ₱456.00 = 45600.
-- =============================================================================

-- ---- 1. one exchange rate for what is shown and what is charged -------------
-- The storefront converts won prices for display; the checkout charges pesos.
-- Both read this table, so the price a customer sees is the price PayMongo
-- charges. Change a rate here and both move together.
create table if not exists public.fx_rates (
  currency       text primary key check (currency in ('PHP', 'IDR', 'KRW')),
  rate_from_krw  numeric(14, 6) not null check (rate_from_krw > 0),
  updated_at     timestamptz not null default now()
);

insert into public.fx_rates (currency, rate_from_krw) values
  ('PHP', 0.042200),
  ('IDR', 11.700000),
  ('KRW', 1.000000)
on conflict (currency) do nothing;

alter table public.fx_rates enable row level security;
drop policy if exists "public read fx_rates" on public.fx_rates;
create policy "public read fx_rates" on public.fx_rates
  for select to anon, authenticated using (true);

-- ---- 2. orders ------------------------------------------------------------
create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  -- a second secret, so knowing an order id alone never reveals the order
  access_token         uuid not null default gen_random_uuid(),
  status               text not null default 'pending'
                       check (status in ('pending', 'paid', 'failed', 'cancelled', 'review')),
  currency             text not null default 'PHP',
  subtotal             integer not null check (subtotal >= 0),
  shipping             integer not null check (shipping >= 0),
  total                integer not null check (total >= 0),
  -- the PHP-per-KRW rate the order was priced at, for the record
  fx_rate              numeric(14, 6) not null,

  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text not null,
  shipping_address     text not null,
  shipping_city        text not null,
  shipping_postal      text not null,
  locale               text,

  checkout_session_id  text unique,
  payment_intent_id    text,
  payment_id           text,
  payment_method       text,
  -- what PayMongo kept and what reaches your balance, in centavos
  payment_fee          integer,
  payment_net          integer,
  paid_at              timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_payment_intent_idx on public.orders (payment_intent_id);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

-- ---- 3. order lines --------------------------------------------------------
create table if not exists public.order_items (
  order_id      uuid not null references public.orders (id) on delete cascade,
  line          integer not null,
  product_id    text not null references public.products (id),
  name          text not null,
  shade         text,
  unit_price    integer not null check (unit_price >= 0),
  quantity      integer not null check (quantity between 1 and 99),
  line_total    integer not null check (line_total >= 0),
  primary key (order_id, line)
);

-- ---- 4. every webhook PayMongo sends, verified or not, for the audit trail --
create table if not exists public.payment_events (
  event_id     text primary key,
  type         text not null,
  livemode     boolean,
  payload      jsonb not null,
  received_at  timestamptz not null default now()
);

-- ---- 5. lock them down: no policies means no access for anon/authenticated -
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.payment_events  enable row level security;

-- keep updated_at honest
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- =============================================================================
--  Useful while testing:
--    select id, status, total / 100.0 as total_php, payment_method, paid_at
--      from public.orders order by created_at desc limit 20;
-- =============================================================================
