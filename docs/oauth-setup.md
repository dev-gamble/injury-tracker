# OAuth setup — Sign in with Apple & Google

These notes walk through wiring "Sign in with Apple" and "Sign in with Google" up to Supabase for ENDEX. The app code is already wired (`components/auth/OAuthButtons.tsx`, login/signup pages, and `/auth/callback`). What's left is the provider-side configuration.

> **Callback URL Supabase needs from each provider**
> `https://<your-project-ref>.supabase.co/auth/v1/callback`
>
> Find `<your-project-ref>` in Supabase → Project Settings → API. The same callback URL is used for both Apple and Google. **Don't** point providers at your own `/auth/callback` route — Supabase intercepts the provider response on its own callback URL, then forwards the user to your app's `/auth/callback` with a `?code=...`, which the existing route exchanges for a session.

---

## 1. Sign in with Apple

Apple Sign In requires three coordinated artifacts: a **Service ID** (the OAuth client ID), an **App ID** (used as the App ID Prefix), and a **Sign in with Apple Key** (the private key used to sign client secrets). You'll create them in Apple Developer, then drop the resulting values into Supabase.

You need an active **Apple Developer Program** membership ($99/yr) — Sign in with Apple is not available on the free tier.

### 1a. Create (or reuse) an App ID

1. Go to <https://developer.apple.com/account/resources/identifiers/list>.
2. Click **+**, choose **App IDs**, then **App**.
3. Description: `ENDEX` (or similar). Bundle ID: `com.cgweblab.endex` (reverse-DNS, must be unique).
4. Capabilities: check **Sign In with Apple**. Leave it on the default "Enable as a primary App ID."
5. Register. **Note the App ID Prefix (Team ID)** shown in the top right of the Apple Developer portal — you'll need it later.

### 1b. Create a Services ID (this is your OAuth client ID)

1. Identifiers → **+** → **Services IDs** → Continue.
2. Description: `ENDEX Web Sign In`. Identifier: `com.cgweblab.endex.signin` (must differ from the App ID — convention is to suffix `.signin` or `.web`).
3. Register, then click the new Services ID to edit it.
4. Check **Sign In with Apple** → click **Configure**.
5. Primary App ID: pick the App ID from step 1a.
6. **Domains and Subdomains:** add the apex domain only, no scheme, no path. Example: `endex.app` (and add `localhost` is **not** allowed — Apple rejects it; for local dev use the live domain or a tunneled hostname like a Cloudflare/ngrok subdomain that Apple will accept).
7. **Return URLs:** add the Supabase callback exactly:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
8. Save → Continue → Save.

> **The Services ID identifier (`com.cgweblab.endex.signin`) is what Supabase calls the "Client ID" for Apple.** Not the App ID, not the Team ID — the Services ID.

### 1c. Create a Sign in with Apple Key

1. Apple Developer → **Keys** → **+**.
2. Key Name: `ENDEX Sign In With Apple`. Check **Sign In with Apple**, click **Configure**, choose the App ID from step 1a, Save.
3. Continue → Register → **Download** the `.p8` file. **You can only download it once** — store it in 1Password or a secure secret store.
4. Note the **Key ID** (10-character string shown next to the key).

### 1d. Generate the Apple client secret JWT

Apple wants a signed JWT as the "client secret" — Supabase asks for the same. The JWT has a max lifetime of **6 months**, so you'll re-mint and rotate it twice a year.

You have two options:

**Option A — Let Supabase mint it for you (recommended, available on most Supabase plans).**
On the Supabase Apple provider page (next section), paste the `.p8` contents, the Key ID, the Team ID, and the Services ID, and Supabase will mint and rotate the JWT for you.

**Option B — Mint the JWT manually.** Required when the Supabase Apple provider doesn't expose `.p8` upload (current dashboard behavior). Use the bundled script:

```bash
APPLE_TEAM_ID=ABCDE12345 \
APPLE_CLIENT_ID=com.endex.web \
APPLE_KEY_ID=DZHA6Z5JKR \
node scripts/generate-apple-secret.mjs
```

The script reads `keys/AuthKey_<APPLE_KEY_ID>.p8` by default (override with `APPLE_KEY_PATH`). Copy the `eyJ...` JWT it prints and paste it into Supabase → Authentication → Providers → Apple → **Secret Key (for OAuth)**. The token is valid for 180 days — set a calendar reminder to re-run the script and re-paste before it expires (otherwise Apple sign-in fails with `invalid_client`).

> **Never commit the `.p8`.** `keys/` is git-ignored. Anyone with the key + Team ID + Key ID + Services ID can impersonate your app's Apple OAuth client.

### 1e. Wire it into Supabase

1. Supabase Dashboard → your project → **Authentication → Providers → Apple** → toggle **Enabled**.
2. Fill in:
   - **Client IDs**: the Services ID (`com.cgweblab.endex.signin`).
   - **Secret Key (for OAuth)**: paste the `.p8` contents *or* the pre-minted JWT, depending on which option above you took.
   - **Team ID**: from step 1a.
   - **Key ID**: from step 1c.
3. Save.

### 1f. Set the Site URL & redirect allowlist

Supabase → Authentication → **URL Configuration**:

- **Site URL**: `https://endex.app` (your production origin).
- **Redirect URLs**: add every origin you launch OAuth from, e.g.:
  - `https://endex.app/auth/callback`
  - `https://staging.endex.app/auth/callback`
  - `http://localhost:3000/auth/callback`

These are the only `redirectTo` values our client is allowed to ask for. The `OAuthButtons` component sends `${window.location.origin}/auth/callback?next=...`, so anything not in the allowlist will fail with `redirect_to is not allowed`.

### 1g. Local development gotcha

Apple **does not accept `localhost`** as a Services-ID domain. Three workable patterns:

1. Test Apple sign-in only against staging/prod.
2. Use a stable tunneled hostname (e.g. `https://endex-dev.cgweblab.com` via Cloudflare Tunnel) for the Apple Services ID and add it to Supabase's redirect allowlist.
3. Develop with Google only locally, run an Apple smoke test on staging.

---

## 2. Sign in with Google

Faster than Apple — no key file, no JWT.

1. <https://console.cloud.google.com/> → create or pick a project.
2. **APIs & Services → OAuth consent screen** → choose **External** → fill in app name (`ENDEX`), support email, developer contact email. Add scopes `openid`, `email`, `profile`. Save. Add your Google account as a Test User while the app is in Testing.
3. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: `ENDEX Supabase`.
   - Authorized JavaScript origins: `https://endex.app`, `http://localhost:3000`.
   - Authorized redirect URIs: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
4. Copy the **Client ID** and **Client Secret**.
5. Supabase → Authentication → Providers → **Google** → toggle Enabled, paste Client ID + Secret. Save.
6. Confirm `localhost:3000/auth/callback` and `endex.app/auth/callback` are in Supabase's redirect allowlist (set up in step 1f above).

When ready to launch, hit **Publish App** on the Google OAuth consent screen so users outside the test list can sign in. Apps requesting only `openid email profile` (we do) skip Google's app-verification process.

---

## 3. Smoke test checklist

After both providers are enabled:

- [ ] `/login` shows two OAuth buttons under the password form.
- [ ] `/signup` shows two OAuth buttons inside each channel panel.
- [ ] Click **Sign in with Google** from `/login` → Google consent → land back on `/`.
- [ ] Click **Sign up with Apple** with **Channel 02 — Access Key** selected → Apple consent → land on `/redeem-key`.
- [ ] Click **Sign up with Google** with **Channel 01 — Subscription** selected → land on `/subscribe`.
- [ ] In Supabase → Authentication → Users, confirm a row exists with `app_metadata.provider = "google"` (or `"apple"`) and `user_metadata.access_channel` matches the channel chosen at signup.
- [ ] Sign out, then re-run the OAuth flow from `/login` — should land on `/` (returning user, has access) or back on the right activation page (returning user, no access).

## 4. Rotating the Apple secret (every ~6 months)

Apple JWTs expire in 6 months max. Calendar reminder:

1. Re-mint the JWT (script in step 1d) using the same `.p8` and Key ID.
2. Paste it into Supabase → Apple provider → **Secret Key**.
3. Save. No code changes, no user-visible disruption.

If Supabase is auto-minting (Option A), no action is needed.
