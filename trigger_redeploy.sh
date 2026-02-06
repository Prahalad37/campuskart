#!/bin/bash

# Force Vercel redeploy via CLI
# This will trigger a new deployment with current environment variables

echo "🚀 Triggering Vercel redeploy..."

# Option 1: Use Vercel CLI (if installed)
if command -v vercel &> /dev/null; then
    echo "Using Vercel CLI..."
    vercel --prod --yes
else
    echo "❌ Vercel CLI not installed"
    echo ""
    echo "MANUAL STEPS:"
    echo "1. Go to: https://vercel.com/prahalads-projects-216e11ca/campuskart"
    echo "2. Click 'Deployments' tab"
    echo "3. Click ⋯ on latest deployment"
    echo "4. Click 'Redeploy'"
    echo "5. Confirm"
    echo ""
    echo "Or install Vercel CLI:"
    echo "npm i -g vercel"
fi
