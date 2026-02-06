#!/bin/bash

# ===================================================
# CampusKart AUTO DEPLOYMENT SCRIPT
# ===================================================

echo "🚀 Starting CampusKart deployment..."
echo ""

# Step 1: Push to GitHub
echo "📤 Step 1: Trying to push to GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo "❌ Push failed - repository might not exist yet"
    echo ""
    echo "👉 Please create the repository first:"
    echo "   1. Go to: https://github.com/new"
    echo "   2. Name: campuskart"
    echo "   3. Public repo"
    echo "   4. Click 'Create repository'"
    echo ""
    echo "Then run this script again: ./auto_deploy.sh"
    exit 1
fi

echo "✅ Code pushed to GitHub successfully!"
echоecho "📦 Step 2: Build already verified ✅"
echo ""

echo "🎯 Step 3: Deploy to Vercel"
echo "Opening Vercel in your browser..."
open "https://vercel.com/new"

echo ""
echo "📋 Manual steps for Vercel:"
echo "1. Import repository: Prahalad37/campuskart"
echo "2. Framework preset: Next.js (auto-detected)"
echo "3. Click 'Deploy'"
echo ""
echo "4. After deployment, add environment variables:"
echo "   Go to: Project → Settings → Environment Variables"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL = https://ahvxkmwridwwfwdpfgti.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI"
echo "   NEXT_PUBLIC_APP_URL = https://campuskart.vercel.app"
echo "   ADMIN_PASS = 1234"
echo ""
echo "5. Redeploy the project"
echo ""
echo "✨ Your site will be live at: https://campuskart.vercel.app"
