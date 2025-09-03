#!/bin/bash

echo "🏀 Basketball Form Analyzer - Build Script"
echo "=========================================="

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode command line tools not found!"
    echo "Please install Xcode from the App Store and run:"
    echo "sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
    exit 1
fi

# Check if project exists
if [ ! -d "BasketballFormAnalyzer.xcodeproj" ]; then
    echo "❌ BasketballFormAnalyzer.xcodeproj not found!"
    echo "Please ensure you're in the correct directory."
    exit 1
fi

echo "✅ Project found. Building..."

# Clean build
echo "🧹 Cleaning previous build..."
xcodebuild clean -project BasketballFormAnalyzer.xcodeproj -scheme BasketballFormAnalyzer

# Build for simulator
echo "🔨 Building for iOS Simulator..."
xcodebuild build -project BasketballFormAnalyzer.xcodeproj -scheme BasketballFormAnalyzer -destination 'platform=iOS Simulator,name=iPhone 15'

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To run on your device:"
    echo "1. Open BasketballFormAnalyzer.xcodeproj in Xcode"
    echo "2. Select your device from the scheme dropdown"
    echo "3. Press Cmd+R to build and run"
    echo ""
    echo "📱 To run on simulator:"
    echo "1. Open BasketballFormAnalyzer.xcodeproj in Xcode"
    echo "2. Select iPhone 15 Simulator"
    echo "3. Press Cmd+R to build and run"
    echo ""
    echo "🎯 Note: Camera features require a physical device for full functionality."
else
    echo "❌ Build failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi 