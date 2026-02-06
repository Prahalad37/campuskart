#!/bin/bash

# CampusKart Deployment Script
# Run after GitHub repo is created

echo "🚀 Connecting to GitHub remote..."
git remote add origin https://github.com/Prahalad37/campuskart.git

echo "📤 Pushing code to GitHub..."
git push -u origin main

echo "✅ Code pushed successfully!"
echo ""
echo "Next step: Run 'npm run build' to verify build works"
