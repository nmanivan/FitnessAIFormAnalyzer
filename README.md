# 💪 FitnessAI Form Analyzer

A React Native app that uses AI to analyze fitness movements and provide real-time coaching feedback through pose detection, accelerometer data, and OpenAI GPT-4 integration.

## 🚀 Features

- **Real-time Pose Detection**: Uses TensorFlow.js MoveNet for body pose analysis
- **Movement Analysis**: Accelerometer-based movement intensity detection
- **AI-Powered Coaching**: OpenAI GPT-4 integration for intelligent feedback
- **Audio Feedback**: Text-to-speech coaching tips
- **Camera Integration**: Real-time video analysis with camera switching
- **Cross-Platform**: Works on iOS and Android via Expo

## 🏗️ Architecture

### Core Components

- **App.js**: Main application component with camera and UI
- **video/videoInput.js**: Movement detection and pose analysis
- **llm/**: AI integration with OpenAI GPT-4
- **audio/audioOutput.js**: Text-to-speech feedback system
- **styles/css/appStyles.js**: UI styling

### AI Integration

- **Real LLM**: Uses OpenAI GPT-4 for movement analysis and coaching
- **Fallback System**: Smart static tips when LLM is unavailable
- **Pose-Based Analysis**: Analyzes body alignment and form
- **Movement Classification**: Categorizes movements (explosive, rhythmic, sustained, controlled)

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator
- OpenAI API key (optional, has fallback)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up OpenAI API (optional):**
   ```bash
   export OPENAI_API_KEY="sk-your-key-here"
   ```
   Or edit `llm/config.js` and replace the placeholder API key.

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - Install Expo Go on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android

## 📱 Usage

1. **Grant camera permissions** when prompted
2. **Press "Start Analysis"** to begin movement tracking
3. **Move your device** to see real-time movement detection
4. **Get AI coaching tips** based on your movements and pose
5. **Listen to audio feedback** for hands-free coaching

## 🎯 Movement Types

- **Explosive**: High-intensity, powerful movements
- **Rhythmic**: Steady, tempo-based movements  
- **Sustained**: Long-duration, endurance movements
- **Controlled**: Precise, deliberate movements

## 🔧 Configuration

### LLM Settings
Edit `llm/config.js` to configure:
- OpenAI API key
- Model parameters
- Fallback behavior

### Performance Tuning
Edit `video/videoInput.js` to adjust:
- Accelerometer update frequency
- Analysis throttling
- Movement detection thresholds

## 📦 Dependencies

### Core
- React Native 0.81.4
- Expo SDK 54
- TensorFlow.js 4.22.0
- OpenAI 4.104.0

### Key Libraries
- `@tensorflow-models/pose-detection`: MoveNet pose detection
- `expo-camera`: Camera integration
- `expo-sensors`: Accelerometer data
- `expo-speech`: Audio feedback
- `@react-native-async-storage/async-storage`: Data persistence

## 🚀 Performance

- **Optimized**: Throttled analysis to reduce API calls
- **Responsive**: Immediate UI updates with batched processing
- **Efficient**: Smart fallbacks and error handling
- **Lightweight**: Minimal dependencies and clean code structure

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**: Ensure camera permissions are granted
2. **LLM not responding**: Check API key or use fallback mode
3. **Performance issues**: Reduce analysis frequency in settings
4. **Build errors**: Use `--legacy-peer-deps` for dependency conflicts

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ using React Native, TensorFlow.js, and OpenAI**