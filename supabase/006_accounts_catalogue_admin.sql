-- =============================================================================
--  006 — accounts, admin, stock, shades, reviews, visits, enquiries
--
--  Run after 005. Safe to re-run: every statement is guarded.
--
--  WHO CAN SEE WHAT
--    profiles          a signed-in customer sees only their own row
--    orders            admins see all; a customer sees the orders carrying
--                      their user_id; the public still sees none (the guest
--                      result page keeps using the order-status function)
--    product_shades,   public read — they are catalogue, like price
--    product_reviews   public read of PUBLISHED reviews only
--    product_views     public INSERT only; nobody can read the raw rows.
--                      Counts are exposed through product_view_counts.
--    enquiries         public INSERT only (contact / delivery forms);
--                      admins read them
--
--  Money stays in centavos. Stock is a plain integer count of units.
-- =============================================================================

-- ---- 1. who is an admin ----------------------------------------------------
-- Admins are Supabase Auth users listed here. Nothing in the app can add a row:
-- you add one yourself in the SQL editor (see the INSERT at the bottom).
create table if not exists public.app_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

alter table public.app_admins enable row level security;

-- SECURITY DEFINER so the check itself is not subject to the policies it feeds;
-- without it, "is this user an admin" would recurse through app_admins' own RLS.
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select exists (select 1 from public.app_admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read admin list" on public.app_admins;
create policy "admins read admin list" on public.app_admins
  for select to authenticated using (public.is_admin());

-- ---- 2. customer profiles --------------------------------------------------
-- Supabase Auth already holds the email and the password. This holds the parts
-- a storefront needs and Auth does not: the name and the default address.
create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text,
  phone             text,
  shipping_address  text,
  shipping_city     text,
  shipping_postal   text,
  locale            public.site_locale,
  marketing_opt_in  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- a row appears the moment someone signs up, so the app never has to create one
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- 3. orders: owner, fulfilment, email ----------------------------------
alter table public.orders add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table public.orders add column if not exists fulfilment text not null default 'unfulfilled'
  check (fulfilment in ('unfulfilled', 'packing', 'shipped', 'delivered', 'returned'));
alter table public.orders add column if not exists courier text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists shipped_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
alter table public.orders add column if not exists admin_note text;
-- stamped by the function that sends the receipt, so it is never sent twice
alter table public.orders add column if not exists confirmation_sent_at timestamptz;

-- the shade as a person reads it ("01 Rose Beige"), beside the hex code the
-- line already stores; the code stays canonical because stock hangs off it
alter table public.order_items add column if not exists shade_name text;

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_fulfilment_idx on public.orders (fulfilment, created_at desc);

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin() or user_id = auth.uid());

-- only an admin may change an order from the browser; payment fields are still
-- written by the Edge Functions with the service role, which bypasses RLS
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items" on public.order_items
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "admins read payment events" on public.payment_events;
create policy "admins read payment events" on public.payment_events
  for select to authenticated using (public.is_admin());

-- ---- 4. shades: a real name, and stock per shade ---------------------------
-- products.colors holds hex codes, which is why a customer sees "Shade #834025"
-- on the payment page. This table gives every swatch a name, and lets a single
-- shade run out without taking the whole product down.
create table if not exists public.product_shades (
  product_id  text not null references public.products (id) on delete cascade,
  code        text not null,                 -- the hex swatch, lowercase
  position    integer not null,
  name_en     text not null,
  name_ko     text,
  name_id     text,
  stock       integer not null default 0 check (stock >= 0),
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now(),
  primary key (product_id, code)
);

alter table public.product_shades enable row level security;

drop policy if exists "public read shades" on public.product_shades;
create policy "public read shades" on public.product_shades
  for select to anon, authenticated using (true);

drop policy if exists "admins write shades" on public.product_shades;
create policy "admins write shades" on public.product_shades
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- seed one row per swatch already on a product, numbered in catalogue order.
-- The names start as "Shade 1", "Shade 2" — rename them with the UPDATE at the
-- bottom of this file. Re-running never overwrites a name you have set.
insert into public.product_shades (product_id, code, position, name_en, stock)
select p.id,
       lower(c.code),
       c.ord,
       'Shade ' || c.ord,
       0
  from public.products p
  cross join lateral unnest(p.colors) with ordinality as c(code, ord)
on conflict (product_id, code) do nothing;

-- ---- 5. stock on the product itself ---------------------------------------
-- track_stock = false keeps a product always buyable, which is what you want
-- until the real counts are loaded.
alter table public.products add column if not exists stock integer not null default 0 check (stock >= 0);
alter table public.products add column if not exists track_stock boolean not null default false;
alter table public.products add column if not exists low_stock_at integer not null default 5;
-- extra words a shopper might type: "waterproof", "matte", "tint", a Korean or
-- Indonesian synonym. The search box reads these alongside the product name.
alter table public.products add column if not exists keywords text[] not null default '{}';

-- what the storefront asks: is this buyable right now?
create or replace view public.product_availability
with (security_invoker = false) as
  select p.id,
         p.is_active,
         p.track_stock,
         case when not p.track_stock then true
              when exists (select 1 from public.product_shades s
                            where s.product_id = p.id and s.is_active and s.stock > 0) then true
              when not exists (select 1 from public.product_shades s where s.product_id = p.id)
                   and p.stock > 0 then true
              else false end as in_stock,
         p.stock,
         p.low_stock_at
    from public.products p
   where p.is_active;

grant select on public.product_availability to anon, authenticated;

-- ---- 6. reviews ------------------------------------------------------------
-- A review is written by a signed-in customer and is not visible until an admin
-- publishes it, so the product page can never be used as an open message board.
create table if not exists public.product_reviews (
  id           uuid primary key default gen_random_uuid(),
  product_id   text not null references public.products (id) on delete cascade,
  user_id      uuid references auth.users (id) on delete set null,
  order_id     uuid references public.orders (id) on delete set null,
  rating       smallint not null check (rating between 1 and 5),
  title        text,
  body         text not null,
  status       text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  created_at   timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists product_reviews_product_idx
  on public.product_reviews (product_id, status, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "public read published reviews" on public.product_reviews;
create policy "public read published reviews" on public.product_reviews
  for select to anon, authenticated using (status = 'published' or user_id = auth.uid() or public.is_admin());

drop policy if exists "customers write own reviews" on public.product_reviews;
create policy "customers write own reviews" on public.product_reviews
  for insert to authenticated with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "admins moderate reviews" on public.product_reviews;
create policy "admins moderate reviews" on public.product_reviews
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- the star rating a card shows, counted from published reviews only
create or replace view public.product_ratings
with (security_invoker = false) as
  select product_id,
         round(avg(rating)::numeric, 2) as average,
         count(*)::integer as review_count
    from public.product_reviews
   where status = 'published'
   group by product_id;

grant select on public.product_ratings to anon, authenticated;

-- ---- 7. visits: RECENT VISIT and MOST VISITED -----------------------------
-- One row per product view. visitor_id is a random id the browser keeps in
-- localStorage — not an account, and never joined to one.
create table if not exists public.product_views (
  id          bigserial primary key,
  product_id  text not null references public.products (id) on delete cascade,
  visitor_id  uuid,
  locale      public.site_locale,
  viewed_at   timestamptz not null default now()
);

create index if not exists product_views_product_idx on public.product_views (product_id, viewed_at desc);
create index if not exists product_views_visitor_idx on public.product_views (visitor_id, viewed_at desc);

alter table public.product_views enable row level security;

-- write-only for the public: a visitor may record a view and read nothing back,
-- so one shopper's browsing is never visible to another
drop policy if exists "anyone records a view" on public.product_views;
create policy "anyone records a view" on public.product_views
  for insert to anon, authenticated with check (true);

drop policy if exists "admins read views" on public.product_views;
create policy "admins read views" on public.product_views
  for select to authenticated using (public.is_admin());

-- MOST VISITED ALL THE TIME — totals only, no visitor is identifiable
create or replace view public.product_view_counts
with (security_invoker = false) as
  select v.product_id,
         count(*)::integer as views,
         count(distinct v.visitor_id)::integer as visitors,
         max(v.viewed_at) as last_viewed_at
    from public.product_views v
    join public.products p on p.id = v.product_id and p.is_active
   group by v.product_id;

grant select on public.product_view_counts to anon, authenticated;

-- ---- 8. CONTACT and DELIVERY enquiries ------------------------------------
-- Both forms land here; `topic` says which one. Anyone may send one, nobody but
-- an admin may read them back.
create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  topic        text not null check (topic in ('contact', 'delivery')),
  name         text not null,
  email        text not null,
  phone        text,
  order_ref    text,
  subject      text,
  message      text not null,
  locale       public.site_locale,
  status       text not null default 'new' check (status in ('new', 'reading', 'answered', 'closed')),
  admin_note   text,
  created_at   timestamptz not null default now(),
  answered_at  timestamptz
);

create index if not exists enquiries_status_idx on public.enquiries (status, created_at desc);

alter table public.enquiries enable row level security;

drop policy if exists "anyone sends an enquiry" on public.enquiries;
create policy "anyone sends an enquiry" on public.enquiries
  for insert to anon, authenticated with check (
    length(name) between 1 and 80
    and length(email) between 3 and 120
    and length(message) between 1 and 4000
  );

drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- 9. grants -------------------------------------------------------------
-- RLS decides who sees which rows; these grants decide who may ask at all.
grant select on public.product_shades, public.product_reviews to anon, authenticated;
grant insert on public.product_views, public.enquiries to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant insert, update on public.product_reviews to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items, public.payment_events, public.app_admins to authenticated;
grant usage, select on sequence public.product_views_id_seq to anon, authenticated;

-- =============================================================================
--  RUN THESE BY HAND, ONCE
-- =============================================================================

-- (a) MAKE YOURSELF AN ADMIN.
--     First create the user: Dashboard → Authentication → Users → Add user
--     (email + password, "Auto Confirm User" on). Then run this with that email:
--
-- insert into public.app_admins (user_id, email)
-- select id, email from auth.users where email = 'dev2@88hotspring.com'
-- on conflict (user_id) do nothing;

-- (b) NAME THE SHADES. One line per swatch; the hex must match products.colors.
--     Check what needs naming:
--
-- select product_id, code, position, name_en from public.product_shades
--  where name_en like 'Shade %' order by product_id, position;
--
-- update public.product_shades
--    set name_en = '01 Rose Beige', name_ko = '01 로즈 베이지', name_id = '01 Rose Beige'
--  where product_id = 'b9' and code = '#834025';

-- (c) LOAD STOCK. Until track_stock is true, a product is always buyable.
--
-- update public.products set stock = 50, track_stock = true where id = 'b8';
-- update public.product_shades set stock = 20 where product_id = 'b9';

-- (d) SEARCH KEYWORDS, if a product is looked up by words not in its name.
--
-- update public.products set keywords = array['waterproof', 'smudge proof', '워터프루프']
--  where id = 'b9';

-- (e) THE EXCHANGE RATE the storefront and the checkout both price with.
--     0.0422 is a placeholder — set the rate you actually want to sell at.
--
-- update public.fx_rates set rate_from_krw = 0.0422, updated_at = now() where currency = 'PHP';
