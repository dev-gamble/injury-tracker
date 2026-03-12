#!/usr/bin/env bash
set -euo pipefail

TUNNEL_PID_FILE=".tunnel.pid"
TUNNEL_URL_FILE=".tunnel.url"

source_file_if_exists() {
  local file_path="$1"
  if [ -f "$file_path" ]; then
    set -a
    source <(sed 's/\r$//' "$file_path")
    set +a
  fi
}

if [ ! -f "$TUNNEL_PID_FILE" ]; then
  echo "No tunnel running."
  exit 0
fi

# Load project env and shared credentials.
source_file_if_exists ".env.local"
if [ -n "${HOME:-}" ]; then
  source_file_if_exists "$HOME/.creds"
elif [ -n "${USERPROFILE:-}" ]; then
  source_file_if_exists "$USERPROFILE/.creds"
fi

PID=$(cat "$TUNNEL_PID_FILE")
kill "$PID" 2>/dev/null && echo "Killed tunnel (PID $PID)." || echo "Process already gone."
rm -f "$TUNNEL_PID_FILE" ".tunnel.log"

if [ ! -f "$TUNNEL_URL_FILE" ]; then
  echo "Done."
  exit 0
fi

TUNNEL_URL=$(cat "$TUNNEL_URL_FILE")

# Restore supabase/config.toml (local dev).
node - "$TUNNEL_URL" <<'EOF'
const fs = require("fs");

const [tunnelUrl] = process.argv.slice(2);
if (!tunnelUrl) {
  throw new Error("Missing tunnel URL argument");
}

const path = "supabase/config.toml";
const config = fs.readFileSync(path, "utf8");
const match = config.match(/additional_redirect_urls\s*=\s*\[(.*?)\]/s);
if (!match) {
  throw new Error("Could not find additional_redirect_urls in supabase/config.toml");
}

const updated = match[1]
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => entry.replace(/^"|"$/g, ""))
  .filter((url) => url !== tunnelUrl && url !== `${tunnelUrl}/reset-password`);

const replacement = `additional_redirect_urls = [${updated.map((url) => `"${url}"`).join(", ")}]`;
const nextConfig = config.replace(/additional_redirect_urls\s*=\s*\[(.*?)\]/s, replacement);

fs.writeFileSync(path, nextConfig);
console.log("Restored supabase/config.toml");
EOF

# Remove from cloud Supabase redirect URLs if credentials are available.
if [ -n "${SUPABASE_ACCESS_TOKEN:-}" ] && [ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]; then
  PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's#https://([a-z0-9-]+)\.supabase\.co.*#\1#')
  if [ -z "$PROJECT_REF" ] || [ "$PROJECT_REF" = "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "Skipping cloud Supabase cleanup - could not parse project ref from NEXT_PUBLIC_SUPABASE_URL"
  else
    node - "$TUNNEL_URL" "$PROJECT_REF" "$SUPABASE_ACCESS_TOKEN" <<'EOF'
const https = require("https");

const [tunnelUrl, projectRef, token] = process.argv.slice(2);
if (!tunnelUrl || !projectRef || !token) {
  throw new Error("Missing required cloud update arguments");
}

function request(method, path, body, authToken) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: "api.supabase.com",
        path,
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: responseBody ? JSON.parse(responseBody) : {} });
          } catch {
            resolve({ status: res.statusCode, body: {} });
          }
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function parseRedirects(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
  return [];
}

async function main() {
  const { body: current } = await request("GET", `/v1/projects/${projectRef}/config/auth`, null, token);
  const toRemove = new Set([tunnelUrl, `${tunnelUrl}/reset-password`]);
  const existing = parseRedirects(current.additional_redirect_urls);
  const updated = existing.filter((url) => !toRemove.has(url)).join(",");

  await request("PATCH", `/v1/projects/${projectRef}/config/auth`, { additional_redirect_urls: updated }, token);
  console.log(`Removed ${tunnelUrl} from cloud Supabase redirect URLs`);
}

main().catch((error) => {
  console.error("Cloud update failed:", error.message);
});
EOF
  fi
else
  echo "Skipping cloud Supabase cleanup - set SUPABASE_ACCESS_TOKEN in ~/.creds to enable it"
fi

rm -f "$TUNNEL_URL_FILE"
echo "Done."
