


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



CREATE INDEX "license_keys_expires_at_idx" ON "public"."license_keys" USING "btree" ("expires_at");



CREATE INDEX "license_keys_status_idx" ON "public"."license_keys" USING "btree" ("status");



CREATE INDEX "stripe_user_subscriptions_customer_id_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("stripe_customer_id");



CREATE INDEX "stripe_user_subscriptions_status_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("status");



CREATE INDEX "stripe_user_subscriptions_user_id_idx" ON "public"."stripe_user_subscriptions" USING "btree" ("user_id");



CREATE INDEX "user_license_keys_license_key_id_idx" ON "public"."user_license_keys" USING "btree" ("license_key_id");



CREATE INDEX "user_license_keys_user_id_idx" ON "public"."user_license_keys" USING "btree" ("user_id");



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



ALTER TABLE "public"."license_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stripe_user_subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stripe_user_subscriptions_self_select" ON "public"."stripe_user_subscriptions" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."user_license_keys" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can view their own redemptions" ON "public"."user_license_keys" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."current_user_group"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_group"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_has_access"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_has_access"() TO "service_role";



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































