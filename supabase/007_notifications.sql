-- =============================================================================
--  007 — in-site notifications
--
--  Run after 006. Safe to re-run.
--
--  Until email is switched on, this is how a customer hears about their order:
--  a bell in the header. Rows are written by TRIGGERS, never by the browser —
--  there is no insert policy at all, so nobody can post a notification to
--  themselves or to anyone else. A member may only read their own and mark
--  them read.
--
--  The text is NOT stored. Only `kind` is, and the page renders it in the
--  language the shopper is reading, which a row written in English could not.
-- =============================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null check (kind in (
                'order_paid', 'order_packing', 'order_shipped',
                'order_delivered', 'order_returned', 'order_failed',
                'review_published'
              )),
  order_id    uuid references public.orders (id) on delete cascade,
  product_id  text references public.products (id) on delete set null,
  -- whatever the row needs beyond its kind: a tracking number, a courier
  detail      jsonb not null default '{}'::jsonb,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx
  on public.notifications (user_id)
  where read_at is null;

alter table public.notifications enable row level security;

drop policy if exists "read own notifications" on public.notifications;
create policy "read own notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- the only thing a member may change is whether they have read it
drop policy if exists "mark own notifications read" on public.notifications;
create policy "mark own notifications read" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, update on public.notifications to authenticated;

-- ---- orders: paid, then each fulfilment stage ------------------------------
create or replace function public.notify_order_change()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  stage_kind text;
begin
  -- a guest order has nobody to notify; the result page is their receipt
  if new.user_id is null then
    return new;
  end if;

  if new.status = 'paid' and old.status is distinct from 'paid' then
    insert into public.notifications (user_id, kind, order_id, detail)
    values (new.user_id, 'order_paid', new.id,
            jsonb_build_object('total', new.total, 'method', new.payment_method));
  end if;

  if new.status = 'failed' and old.status is distinct from 'failed' then
    insert into public.notifications (user_id, kind, order_id)
    values (new.user_id, 'order_failed', new.id);
  end if;

  if new.fulfilment is distinct from old.fulfilment then
    stage_kind := case new.fulfilment
      when 'packing'   then 'order_packing'
      when 'shipped'   then 'order_shipped'
      when 'delivered' then 'order_delivered'
      when 'returned'  then 'order_returned'
      else null
    end;

    if stage_kind is not null then
      insert into public.notifications (user_id, kind, order_id, detail)
      values (new.user_id, stage_kind, new.id,
              jsonb_build_object('courier', new.courier, 'tracking', new.tracking_number));
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_order_change on public.orders;
create trigger on_order_change
  after update on public.orders
  for each row execute function public.notify_order_change();

-- ---- reviews: tell the writer when theirs goes live ------------------------
create or replace function public.notify_review_published()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' and new.user_id is not null then
    insert into public.notifications (user_id, kind, product_id)
    values (new.user_id, 'review_published', new.product_id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_review_published on public.product_reviews;
create trigger on_review_published
  after update on public.product_reviews
  for each row execute function public.notify_review_published();

-- =============================================================================
--  CHECK IT WORKS
--    Mark one of your own paid orders as shipped in /admin/orders, then:
--
--  select kind, order_id, detail, created_at
--    from public.notifications order by created_at desc limit 10;
-- =============================================================================
