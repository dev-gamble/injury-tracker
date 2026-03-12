#!/usr/bin/env bash
set -euo pipefail

PORT=3000
TUNNEL_LOG=".tunnel.log"
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

if [ -f "$TUNNEL_PID_FILE" ]; then
  echo "Tunnel already running (PID $(cat "$TUNNEL_PID_FILE")). Run ./tunnel-stop.sh first."
  exit 1
fi

# Load project env and shared credentials.
source_file_if_exists ".env.local"
if [ -n "${HOME:-}" ]; then
  source_file_if_exists "$HOME/.creds"
elif [ -n "${USERPROFILE:-}" ]; then
  source_file_if_exists "$USERPROFILE/.creds"
fi

echo "Starting localtunnel on port $PORT..."
npx --yes localtunnel --port "$PORT" > "$TUNNEL_LOG" 2>&1 &
echo $! > "$TUNNEL_PID_FILE"

echo -n "Waiting for tunnel URL"
TUNNEL_URL=""
for _ in $(seq 1 30); do
  sleep 0.5
  echo -n "."
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.loca\.lt' "$TUNNEL_LOG" 2>/dev/null | head -1 || true)
  if [ -n "$TUNNEL_URL" ]; then
    break
  fi
done
echo ""

if [ -z "$TUNNEL_URL" ]; then
  echo "Error: could not get tunnel URL. Check $TUNNEL_LOG"
  kill "$(cat "$TUNNEL_PID_FILE")" 2>/dev/null || true
  rm -f "$TUNNEL_PID_FILE" "$TUNNEL_LOG"
  exit 1
fi

echo "$TUNNEL_URL" > "$TUNNEL_URL_FILE"
echo ""
echo "  Tunnel: $TUNNEL_URL"
echo ""

# Update supabase/config.toml (local dev).
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

const existing = match[1]
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => entry.replace(/^"|"$/g, ""));

const updated = [...new Set([...existing, tunnelUrl, `${tunnelUrl}/reset-password`])];
const replacement = `additional_redirect_urls = [${updated.map((url) => `"${url}"`).join(", ")}]`;
const nextConfig = config.replace(/additional_redirect_urls\s*=\s*\[(.*?)\]/s, replacement);

fs.writeFileSync(path, nextConfig);
console.log("Updated supabase/config.toml");
EOF

# Update cloud Supabase redirect URLs if credentials are available.
if [ -n "${SUPABASE_ACCESS_TOKEN:-}" ] && [ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]; then
  PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's#https://([a-z0-9-]+)\.supabase\.co.*#\1#')
  if [ -z "$PROJECT_REF" ] || [ "$PROJECT_REF" = "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "  (Skipping cloud Supabase update - could not parse project ref from NEXT_PUBLIC_SUPABASE_URL)"
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
  const existing = parseRedirects(current.additional_redirect_urls);
  const toAdd = [tunnelUrl, `${tunnelUrl}/reset-password`];
  const updated = [...new Set([...existing, ...toAdd])].join(",");

  await request("PATCH", `/v1/projects/${projectRef}/config/auth`, { additional_redirect_urls: updated }, token);
  console.log("Updated cloud Supabase redirect URLs");
}

main().catch((error) => {
  console.error("Cloud update failed:", error.message);
});
EOF
  fi
else
  echo "  (Skipping cloud Supabase update - set SUPABASE_ACCESS_TOKEN in ~/.creds to enable it)"
fi

echo "  Run ./tunnel-stop.sh to stop and clean up."
