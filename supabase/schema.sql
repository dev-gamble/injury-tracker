


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."license_status" AS ENUM (
    'active',
    'revoked',
    'expired'
);


ALTER TYPE "public"."license_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."anonymize_visit_events"("anonymize_after_days" integer DEFAULT 14) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
declare
  affected integer;
begin
  -- Anonymization intent: an old row should not be linkable back to a person.
  -- That means we strip *every* identifier — IP truncated, UA dropped, and
  -- user_id nulled. Aggregation fields (path, country, timestamps) stay so
  -- the dashboard's window-spanning charts remain accurate after the cutoff.
  update public.visit_events
     set ip_address = case
                        when family(ip_address) = 4 then set_masklen(ip_address, 24)::cidr::inet
                        else set_masklen(ip_address, 48)::cidr::inet
                      end,
         user_agent = null,
         user_id    = null
   where created_at < now() - make_interval(days => anonymize_after_days)
     and (
       (family(ip_address) = 4 and masklen(ip_address) = 32) or
       (family(ip_address) = 6 and masklen(ip_address) = 128) or
       user_agent is not null or
       user_id is not null
     );
  get diagnostics affected = row_count;
  return affected;
end;
$$;


ALTER FUNCTION "public"."anonymize_visit_events"("anonymize_after_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_group"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select jsonb_build_object('name', lk.group_name, 'color', lk.group_color)
  from public.user_license_keys ulk
  join public.license_keys lk on lk.id = ulk.license_key_id
  where ulk.user_id = (select auth.uid())
    and lk.status = 'active'
    and (lk.expires_at is null or lk.expires_at > now())
  order by lk.expires_at desc nulls first
  limit 1;
$$;


ALTER FUNCTION "public"."current_user_group"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_has_access"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select exists (
    select 1
    from public.user_license_keys ulk
    join public.license_keys lk on lk.id = ulk.license_key_id
    where ulk.user_id = (select auth.uid())
      and lk.status = 'active'
      and (lk.expires_at is null or lk.expires_at > now())
  )
  or exists (
    select 1
    from public.stripe_user_subscriptions s
    where s.user_id = (select auth.uid())
      and s.status in ('active', 'trialing', 'past_due')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;


ALTER FUNCTION "public"."current_user_has_access"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_daily_series"("window_days" integer DEFAULT 30) RETURNS TABLE("bucket_start" timestamp with time zone, "visits" bigint, "uniques" bigint)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  with axis as (
    select generate_series(
      date_trunc('day', now()) - make_interval(days => window_days - 1),
      date_trunc('day', now()),
      interval '1 day'
    ) as day
  ),
  buckets as (
    select
      date_trunc('day', created_at)            as day,
      count(*)::bigint                         as visits,
      count(distinct ip_address)::bigint       as uniques
    from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
    group by 1
  )
  select
    a.day                            as bucket_start,
    coalesce(b.visits, 0)::bigint    as visits,
    coalesce(b.uniques, 0)::bigint   as uniques
  from axis a
  left join buckets b on b.day = a.day
  order by a.day;
$$;


ALTER FUNCTION "public"."get_visit_daily_series"("window_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_summary"("window_days" integer DEFAULT 30) RETURNS TABLE("total_count" bigint, "window_count" bigint, "unique_ips" bigint, "last_24h" bigint, "prev_24h" bigint, "top_country_code" "text", "top_country_count" bigint)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  with windowed as (
    select * from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  ),
  top_country as (
    select country_code, count(*)::bigint as c
    from windowed
    where country_code is not null
    group by country_code
    order by c desc
    limit 1
  )
  select
    (select count(*)::bigint from public.visit_events) as total_count,
    (select count(*)::bigint from windowed) as window_count,
    (select count(distinct ip_address)::bigint from windowed) as unique_ips,
    (select count(*)::bigint from public.visit_events where created_at >= now() - interval '1 day') as last_24h,
    (select count(*)::bigint from public.visit_events where created_at >= now() - interval '2 days' and created_at < now() - interval '1 day') as prev_24h,
    (select country_code from top_country) as top_country_code,
    coalesce((select c from top_country), 0)::bigint as top_country_count;
$$;


ALTER FUNCTION "public"."get_visit_summary"("window_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_top_countries"("window_days" integer DEFAULT 30, "row_limit" integer DEFAULT 12) RETURNS TABLE("country_code" "text", "country_name" "text", "count" bigint)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select
    coalesce(country_code, '—') as country_code,
    coalesce(max(country_name), '—') as country_name,
    count(*)::bigint as count
  from public.visit_events
  where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  group by 1
  order by count desc
  limit greatest(1, row_limit);
$$;


ALTER FUNCTION "public"."get_visit_top_countries"("window_days" integer, "row_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_top_ips"("window_days" integer DEFAULT 30, "row_limit" integer DEFAULT 25) RETURNS TABLE("ip_address" "inet", "count" bigint, "last_seen" timestamp with time zone, "country_code" "text", "city" "text")
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  with by_ip as (
    select
      ip_address,
      count(*)::bigint as count,
      max(created_at)  as last_seen
    from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
    group by ip_address
    order by count desc
    limit greatest(1, row_limit)
  )
  select
    b.ip_address,
    b.count,
    b.last_seen,
    -- Pick the most recent geo we observed for this IP — the lookup may have
    -- been NULL on early hits and resolved later by the after-task.
    (
      select country_code from public.visit_events ve
      where ve.ip_address = b.ip_address and ve.country_code is not null
      order by ve.created_at desc limit 1
    ) as country_code,
    (
      select city from public.visit_events ve
      where ve.ip_address = b.ip_address and ve.city is not null
      order by ve.created_at desc limit 1
    ) as city
  from by_ip b
  order by b.count desc;
$$;


ALTER FUNCTION "public"."get_visit_top_ips"("window_days" integer, "row_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_top_paths"("window_days" integer DEFAULT 30, "row_limit" integer DEFAULT 12) RETURNS TABLE("path" "text", "count" bigint)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select path, count(*)::bigint as count
  from public.visit_events
  where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  group by path
  order by count desc
  limit greatest(1, row_limit);
$$;


ALTER FUNCTION "public"."get_visit_top_paths"("window_days" integer, "row_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prune_visit_events"("retain_days" integer DEFAULT 180) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
declare
  affected integer;
begin
  delete from public.visit_events
   where created_at < now() - make_interval(days => retain_days);
  get diagnostics affected = row_count;
  return affected;
end;
$$;


ALTER FUNCTION "public"."prune_visit_events"("retain_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."redeem_license_key"("raw_key" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
declare
  v_user_id        uuid := auth.uid();
  v_hash           bytea;
  v_key            public.license_keys%rowtype;
  v_redemption_id  uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_hash := digest(raw_key, 'sha256');

  select * into v_key
  from public.license_keys
  where key_hash = v_hash
  for update;

  if not found then
    raise exception 'invalid_key' using errcode = 'P0002';
  end if;

  if v_key.status = 'revoked' then
    raise exception 'revoked' using errcode = 'P0001';
  end if;

  if v_key.expires_at is not null and v_key.expires_at <= now() then
    raise exception 'expired' using errcode = 'P0001';
  end if;

  if v_key.current_uses >= v_key.max_uses then
    raise exception 'exhausted' using errcode = 'P0001';
  end if;

  begin
    insert into public.user_license_keys (user_id, license_key_id)
    values (v_user_id, v_key.id)
    returning id into v_redemption_id;
  exception when unique_violation then
    raise exception 'already_redeemed' using errcode = 'P0001';
  end;

  -- current_uses is incremented by user_license_keys_sync_count trigger
  return v_redemption_id;
end;
$$;


ALTER FUNCTION "public"."redeem_license_key"("raw_key" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at := now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_license_key_uses"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  if tg_op = 'INSERT' then
    update public.license_keys
       set current_uses = current_uses + 1
     where id = new.license_key_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.license_keys
       set current_uses = greatest(current_uses - 1, 0)
     where id = old.license_key_id;
    return old;
  end if;
  return null;
end;
$$;


ALTER FUNCTION "public"."sync_license_key_uses"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."license_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key_hash" "bytea" NOT NULL,
    "key_prefix" "text" NOT NULL,
    "group_name" "text" NOT NULL,
    "status" "public"."license_status" DEFAULT 'active'::"public"."license_status" NOT NULL,
    "max_uses" integer DEFAULT 1 NOT NULL,
    "current_uses" integer DEFAULT 0 NOT NULL,
    "expires_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "group_color" "text" NOT NULL,
    CONSTRAINT "license_keys_current_uses_check" CHECK (("current_uses" >= 0)),
    CONSTRAINT "license_keys_group_color_hex" CHECK (("group_color" ~ '^#[0-9a-fA-F]{6}$'::"text")),
    CONSTRAINT "license_keys_group_name_nonempty" CHECK ((("length"("btrim"("group_name")) >= 1) AND ("length"("btrim"("group_name")) <= 32))),
    CONSTRAINT "license_keys_max_uses_check" CHECK (("max_uses" >= 1)),
    CONSTRAINT "license_keys_uses_within_max" CHECK (("current_uses" <= "max_uses"))
);


ALTER TABLE "public"."license_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stripe_user_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "stripe_subscription_id" "text" NOT NULL,
    "stripe_price_id" "text" NOT NULL,
    "status" "text" NOT NULL,
    "current_period_end" timestamp with time zone,
    "cancel_at_period_end" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cancel_at" timestamp with time zone,
    "canceled_at" timestamp with time zone,
    "unit_amount" integer,
    "currency" "text",
    "recurring_interval" "text",
    "recurring_interval_count" integer,
    "discount_amount_off" integer,
    "discount_percent_off" numeric(5,2),
    "discount_promotion_code" "text",
    "discount_duration" "text",
    "discount_duration_in_months" integer,
    "discount_end" timestamp with time zone,
    "livemode" boolean
);


ALTER TABLE "public"."stripe_user_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_license_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "license_key_id" "uuid" NOT NULL,
    "redeemed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_license_keys" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_access" WITH ("security_invoker"='true') AS
 SELECT "ulk"."user_id",
    "lk"."id" AS "license_key_id",
    "lk"."group_name",
    "lk"."group_color",
    "lk"."expires_at"
   FROM ("public"."user_license_keys" "ulk"
     JOIN "public"."license_keys" "lk" ON (("lk"."id" = "ulk"."license_key_id")))
  WHERE (("lk"."status" = 'active'::"public"."license_status") AND (("lk"."expires_at" IS NULL) OR ("lk"."expires_at" > "now"())));


ALTER VIEW "public"."user_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visit_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ip_address" "inet" NOT NULL,
    "user_agent" "text",
    "path" "text" NOT NULL,
    "referrer" "text",
    "country_code" "text",
    "country_name" "text",
    "region" "text",
    "city" "text",
    "latitude" double precision,
    "longitude" double precision,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visit_events" OWNER TO "postgres";


ALTER TABLE ONLY "public"."license_keys"
    ADD CONSTRAINT "license_keys_key_hash_key" UNIQUE ("key_hash");



ALTER TABLE ONLY "public"."license_keys"
    ADD CONSTRAINT "license_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_user_subscriptions"
    ADD CONSTRAINT "stripe_user_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_user_subscriptions"
    ADD CONSTRAINT "stripe_user_subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



ALTER TABLE ONLY "public"."user_license_keys"
    ADD CONSTRAINT "user_license_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_license_keys"
    ADD CONSTRAINT "user_license_keys_user_id_license_key_id_key" UNIQUE ("user_id", "license_key_id");



ALTER TABLE ONLY "public"."visit_events"
    ADD CONSTRAINT "visit_events_pkey" PRIMARY KEY ("id");



CREATE INDEX "license_keys_expires_at_idx" ON "public"."license_keys" USING "btree" ("expires_at");



CREATE INDEX "license_keys_status_idx" ON "public"."license_keys" USING "btree" ("status");



CREATE INDEX "stripe_user_subscriptions_customer_id_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("stripe_customer_id");



CREATE INDEX "stripe_user_subscriptions_status_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("status");



CREATE INDEX "stripe_user_subscriptions_user_id_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("user_id");



CREATE INDEX "user_license_keys_license_key_id_idx" ON "public"."user_license_keys" USING "btree" ("license_key_id");



CREATE INDEX "user_license_keys_user_id_idx" ON "public"."user_license_keys" USING "btree" ("user_id");



CREATE INDEX "visit_events_country_idx" ON "public"."visit_events" USING "btree" ("country_code");



CREATE INDEX "visit_events_created_at_idx" ON "public"."visit_events" USING "btree" ("created_at" DESC);



CREATE INDEX "visit_events_ip_idx" ON "public"."visit_events" USING "btree" ("ip_address");



CREATE INDEX "visit_events_path_idx" ON "public"."visit_events" USING "btree" ("path");



CREATE OR REPLACE TRIGGER "stripe_user_subscriptions_set_updated_at" BEFORE UPDATE ON "public"."stripe_user_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "user_license_keys_sync_count" AFTER INSERT OR DELETE ON "public"."user_license_keys" FOR EACH ROW EXECUTE FUNCTION "public"."sync_license_key_uses"();



ALTER TABLE ONLY "public"."license_keys"
    ADD CONSTRAINT "license_keys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."stripe_user_subscriptions"
    ADD CONSTRAINT "stripe_user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_license_keys"
    ADD CONSTRAINT "user_license_keys_license_key_id_fkey" FOREIGN KEY ("license_key_id") REFERENCES "public"."license_keys"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."user_license_keys"
    ADD CONSTRAINT "user_license_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visit_events"
    ADD CONSTRAINT "visit_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE "public"."license_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stripe_user_subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stripe_user_subscriptions_self_select" ON "public"."stripe_user_subscriptions" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."user_license_keys" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can view their own redemptions" ON "public"."user_license_keys" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."visit_events" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































REVOKE ALL ON FUNCTION "public"."anonymize_visit_events"("anonymize_after_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."anonymize_visit_events"("anonymize_after_days" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_group"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_has_access"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_visit_daily_series"("window_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_visit_daily_series"("window_days" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_visit_summary"("window_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_visit_summary"("window_days" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_visit_top_countries"("window_days" integer, "row_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_visit_top_countries"("window_days" integer, "row_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_visit_top_ips"("window_days" integer, "row_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_visit_top_ips"("window_days" integer, "row_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_visit_top_paths"("window_days" integer, "row_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_visit_top_paths"("window_days" integer, "row_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."prune_visit_events"("retain_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."prune_visit_events"("retain_days" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."redeem_license_key"("raw_key" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."redeem_license_key"("raw_key" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."redeem_license_key"("raw_key" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_license_key_uses"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_license_key_uses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_license_key_uses"() TO "service_role";
























GRANT ALL ON TABLE "public"."license_keys" TO "service_role";



GRANT ALL ON TABLE "public"."stripe_user_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."stripe_user_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_user_subscriptions" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_license_keys" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_license_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."user_license_keys" TO "service_role";



GRANT ALL ON TABLE "public"."user_access" TO "anon";
GRANT ALL ON TABLE "public"."user_access" TO "authenticated";
GRANT ALL ON TABLE "public"."user_access" TO "service_role";



GRANT ALL ON TABLE "public"."visit_events" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































