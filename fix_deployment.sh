#!/bin/bash

# Quick Fix Script for Vercel Deployment
# This opens all necessary pages and provides instructions

echo "🔧 Opening Vercel Environment Variables page..."
open "https://vercel.com/prahalad37/campuskart/settings/environment-variables"

sleep 2

echo ""
echo "📋 ADD THESE 4 ENVIRONMENT VARIABLES:"
echo "===================================="
echo ""
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "   Value: https://ahvxkmwridwwfwdpfgti.supabase.co"
echo ""
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI"
echo ""
echo "3. NEXT_PUBLIC_APP_URL"
echo "   Value: https://campuskart.vercel.app"
echo ""
echo "4. ADMIN_PASS"
echo "   Value: 1234"
echo ""
echo "===================================="
echo ""
echo "After adding all 4 variables:"
echo "1. Click 'Save'"
echo "2. Go to 'Deployments' tab"
echo "3. Click the ⋯ menu on latest deployment"
echo "4. Click 'Redeploy'"
echo ""
echo "Wait 2-3 minutes for redeploy to complete!"
echo ""
echo "Then test: https://campuskart.vercel.app/s/dps-rohini"
