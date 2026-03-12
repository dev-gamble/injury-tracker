#!/usr/bin/env bash
# Usage: bash init.sh <project-name>
# Installs deps, provisions a new Supabase project, and writes .env.local.
# After this runs: npm run dev

set -e

PROJECT_NAME=${1:-""}

if [ -z "$PROJECT_NAME" ]; then
  echo ""
  echo "Usage: bash init.sh <project-name>"
  echo "Example: bash init.sh my-app"
  echo ""
  exit 1
fi

echo ""
echo "==> Installing dependencies..."
npm install

echo ""
echo "==> Setting up Supabase database..."
npm run db:setup "$PROJECT_NAME"

echo ""
echo "==> Ready! Start your app with:"
echo "    npm run dev"
echo ""
