#!/bin/bash

echo "🚀 ZipFlow Auto Deploy Script"
echo "=============================="

# Detect platform
detect_platform() {
    if [ -f /etc/cpanel ]; then
        echo "cPanel detected"
        PLATFORM="cpanel"
    elif [ -f /etc/plesk ]; then
        echo "Plesk detected"
        PLATFORM="plesk"
    elif command -v systemctl &> /dev/null; then
        echo "Systemd detected (VPS/Dedicated)"
        PLATFORM="vps"
    else
        echo "Unknown platform"
        PLATFORM="unknown"
    fi
}

# Build application
build_app() {
    echo "📦 Building application..."
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

# Deploy to cPanel
deploy_cpanel() {
    echo "🌐 Deploying to cPanel..."
    
    # Create dist folder
    mkdir -p dist
    
    # Copy necessary files
    cp -r .next dist/
    cp -r public dist/
    cp package.json dist/
    cp next.config.js dist/
    cp .htaccess dist/
    
    echo "📁 Files ready for upload to public_html"
    echo "📂 Upload all contents of 'dist' folder to your hosting"
}

# Deploy to VPS
deploy_vps() {
    echo "🖥️ Deploying to VPS..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Installing PM2..."
        sudo npm install -g pm2
    fi
    
    # Start application with PM2
    pm2 start npm --name "zipflow" -- start
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    echo "✅ Application started with PM2"
}

# Setup environment
setup_env() {
    echo "⚙️ Setting up environment..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        echo "📝 Please edit .env file with your configuration"
    fi
}

# Main deployment function
main() {
    detect_platform
    build_app
    setup_env
    
    case $PLATFORM in
        "cpanel")
            deploy_cpanel
            ;;
        "vps")
            deploy_vps
            ;;
        *)
            echo "⚠️ Unknown platform, using generic deployment"
            deploy_cpanel
            ;;
    esac
    
    echo "🎉 Deployment completed!"
    echo "🌐 Your app should be available at your domain"
}

# Run main function
main 