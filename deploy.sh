#!/usr/bin/env bash
set -euo pipefail

# Load production env vars
if [ ! -f .env.production ]; then
  echo "Error: .env.production not found."
  echo "Copy .env.production.example -> .env.production and fill in the values."
  exit 1
fi

# shellcheck source=/dev/null
source .env.production

: "${IMAGE_NAME:?IMAGE_NAME must be set in .env.production}"
: "${DO_REGISTRY:?DO_REGISTRY must be set in .env.production}"
: "${NEXT_PUBLIC_SUPABASE_URL:?NEXT_PUBLIC_SUPABASE_URL must be set in .env.production}"
: "${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:?NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set in .env.production}"
: "${SUPABASE_HOSTNAME:?SUPABASE_HOSTNAME must be set in .env.production}"

TAG="${1:-latest}"
REMOTE_IMAGE="$DO_REGISTRY/$IMAGE_NAME:$TAG"

# Build
echo "==> Building $IMAGE_NAME:$TAG..."
AXIOM_ARGS=()
if [ -n "${NEXT_PUBLIC_AXIOM_TOKEN:-}" ] && [ -n "${NEXT_PUBLIC_AXIOM_DATASET:-}" ]; then
  NEXT_PUBLIC_AXIOM_LOG_LEVEL="${NEXT_PUBLIC_AXIOM_LOG_LEVEL:-info}"
  AXIOM_ARGS+=(--build-arg "NEXT_PUBLIC_AXIOM_TOKEN=$NEXT_PUBLIC_AXIOM_TOKEN")
  AXIOM_ARGS+=(--build-arg "NEXT_PUBLIC_AXIOM_DATASET=$NEXT_PUBLIC_AXIOM_DATASET")
  AXIOM_ARGS+=(--build-arg "NEXT_PUBLIC_AXIOM_LOG_LEVEL=$NEXT_PUBLIC_AXIOM_LOG_LEVEL")
  echo "==> Axiom build args enabled."
else
  echo "==> Axiom build args not provided. Logs will remain local/console."
fi

docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  --build-arg SUPABASE_HOSTNAME="$SUPABASE_HOSTNAME" \
  "${AXIOM_ARGS[@]}" \
  -t "$IMAGE_NAME:$TAG" \
  .

# Tag and push
echo "==> Tagging as $REMOTE_IMAGE..."
docker tag "$IMAGE_NAME:$TAG" "$REMOTE_IMAGE"

echo "==> Pushing to $DO_REGISTRY..."
docker push "$REMOTE_IMAGE"

echo ""
echo "Done! $REMOTE_IMAGE"
