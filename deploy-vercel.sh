#!/bin/bash

echo "🚀 ZipFlow Vercel Deployment Script"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
        if [ $? -eq 0 ]; then
            print_status "Vercel CLI installed successfully"
        else
            print_error "Failed to install Vercel CLI"
            exit 1
        fi
    else
        print_status "Vercel CLI found"
    fi
}

# Check if user is logged in to Vercel
check_vercel_login() {
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login..."
        vercel login
        if [ $? -eq 0 ]; then
            print_status "Logged in to Vercel successfully"
        else
            print_error "Failed to login to Vercel"
            exit 1
        fi
    else
        print_status "Already logged in to Vercel"
    fi
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if --prod flag is provided
    if [[ $* == *"--prod"* ]]; then
        print_status "Deploying to production..."
        vercel --prod
    else
        print_status "Deploying to preview..."
        vercel
    fi
    
    if [ $? -eq 0 ]; then
        print_status "Deployment completed successfully!"
        echo ""
        echo "🌐 Your app is now live!"
        echo "📊 Check your Vercel dashboard for more details"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        cp env.example .env.local
        print_warning "Created .env.local from template"
        print_warning "Please edit .env.local with your configuration"
    fi
}

# Main deployment function
main() {
    echo "Starting Vercel deployment process..."
    echo ""
    
    check_vercel_cli
    check_vercel_login
    setup_env
    build_app
    deploy_to_vercel "$@"
    
    echo ""
    print_status "Deployment process completed!"
}

# Run main function with all arguments
main "$@" 