-- The tracker HTML header shows the signed-in user's email + tier so it's
-- always clear which seat is in use. The tier shown must come from the same
-- predicate that the middleware gates on: an access row is only considered
-- if the underlying license_key is active AND not expired. If every row the
-- user holds is revoked or expired, the function returns NULL and the header
-- simply omits the badge (middleware will have already bounced them to
-- /redeem-key before the HTML ever renders).
--
-- Multiple keys per user are allowed. If the user holds several active keys
-- (e.g., a partner seat + a personal demo key), pick the most-privileged tier
-- so the header reflects their actual capability.

create or replace function public.current_user_tier()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select lk.tier::text
  from public.user_license_keys ulk
  join public.license_keys lk on lk.id = ulk.license_key_id
  where ulk.user_id = (select auth.uid())
    and lk.status = 'active'
    and (lk.expires_at is null or lk.expires_at > now())
  order by
    case lk.tier
      when 'partner' then 1
      when 'full'    then 2
      when 'free'    then 3
      when 'demo'    then 4
    end,
    lk.expires_at desc nulls first
  limit 1;
$$;

revoke all on function public.current_user_tier() from public;
grant execute on function public.current_user_tier() to authenticated;
