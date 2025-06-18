#!/bin/bash

echo "🔧 Fixing Vercel Deployment Issues"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Install missing dependencies
print_status "Installing missing dependencies..."
npm install @radix-ui/react-switch@^1.1.2

# Step 2: Clean and reinstall
print_status "Cleaning and reinstalling dependencies..."
rm -rf node_modules
rm -rf .next
npm install

# Step 3: Test build locally
print_status "Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Local build successful!"
else
    print_error "Local build failed. Please check the errors above."
    exit 1
fi

# Step 4: Commit and push changes
print_status "Committing changes..."
git add .
git commit -m "Fix: Add missing @radix-ui/react-switch dependency"

print_status "Pushing to repository..."
git push

# Step 5: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_status "Deployment completed!"
echo ""
echo "🌐 Your app should now be live on Vercel!"
echo "📊 Check your Vercel dashboard for the deployment status" 