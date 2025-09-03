# Fitness Form Analyzer iOS App

A real-time Fitness coaching app that analyzes your form using computer vision and provides instant audio feedback through headphones.

## 🏀 Features

- **Real-time Video Analysis**: Captures live video from your iPhone camera
- **Pose Estimation**: Uses Vision framework for body pose detection
- **AI Coaching**: LLM-powered feedback on Fitness technique
- **Audio Feedback**: Real-time coaching tips through headphones
- **Form Tracking**: Monitors shooting, dribbling, and defensive stances

## 🛠 Technical Stack

- **iOS 15.0+** with SwiftUI
- **Vision Framework** for pose estimation
- **AVFoundation** for camera and audio handling
- **Speech Synthesis** for audio feedback
- **Core ML** for on-device AI processing

## 📱 Setup Instructions

1. Open `FitnessFormAnalyzer.xcodeproj` in Xcode
2. Set your development team in project settings
3. Add camera and microphone permissions to Info.plist
4. Build and run on your iPhone

## 🔐 Permissions Required

- Camera access for video recording
- Microphone access for audio feedback
- Motion & Fitness for enhanced pose tracking

## 🎯 Usage

1. Launch the app and grant permissions
2. Position your phone to capture your basketball activity
3. Start your basketball session
4. Receive real-time audio coaching feedback
5. Review form analysis in the app

## 🏗 Architecture

- `ContentView`: Main app interface
- `CameraManager`: Handles video capture and processing
- `PoseAnalyzer`: Processes pose data and identifies basketball movements
- `AudioFeedbackManager`: Manages text-to-speech coaching feedback
- `BasketballCoachAI`: AI logic for technique analysis and recommendations 