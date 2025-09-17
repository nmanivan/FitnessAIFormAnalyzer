# LLM Setup Guide

Your FitnessAI Form Analyzer now uses **real LLM integration** with OpenAI's GPT-4 for intelligent pose analysis and coaching feedback!

## 🚀 Quick Setup

### 1. Install OpenAI Package
```bash
npm install openai
```

### 2. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 3. Configure Your API Key

**Option A: Environment Variable (Recommended)**
```bash
export OPENAI_API_KEY="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"
```

**Option B: Direct Configuration**
Edit `llm/config.js` and replace:
```javascript
OPENAI_API_KEY: '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'
```
with your actual API key.

## 🧠 What the LLM Does

### **Movement Analysis**
- Analyzes accelerometer data + pose data
- Classifies movements: `explosive`, `rhythmic`, `sustained`, `controlled`
- Uses GPT-4's reasoning for intelligent classification

### **Pose-Based Coaching**
- Analyzes body alignment (shoulders, hips, knees, ankles)
- Provides specific form corrections
- Gives encouraging, actionable feedback

### **Contextual Tips**
- Generates personalized coaching tips
- Adapts to your current movement and pose quality
- Provides real-time form guidance

## 🔧 Configuration Options

Edit `llm/config.js` to customize:

```javascript
export const LLM_CONFIG = {
  OPENAI_API_KEY: 'your-key-here',
  MODEL: 'gpt-4',              // or 'gpt-4-turbo'
  MAX_TOKENS: 50,              // response length
  TEMPERATURE: 0.7,            // creativity (0-1)
  MAX_REQUESTS_PER_MINUTE: 20, // rate limiting
  ENABLE_FALLBACK: true        // fallback when LLM fails
};
```

## 💡 How It Works

1. **Real-time Analysis**: Your movement and pose data is sent to GPT-4
2. **Intelligent Processing**: GPT-4 analyzes patterns and provides insights
3. **Personalized Feedback**: Get specific, contextual coaching tips
4. **Fallback System**: Smart fallbacks when LLM is unavailable

## 🛡️ Privacy & Security

- Your pose data is sent to OpenAI for analysis
- No personal information is stored
- API calls are made securely over HTTPS
- Consider OpenAI's data usage policies

## 🚨 Troubleshooting

**"OpenAI not available"**
- Check your API key is correct
- Ensure you have OpenAI credits
- Verify internet connection

**"LLM analysis error"**
- Check API key permissions
- Verify OpenAI account status
- App will use fallback tips automatically

## 💰 Cost Considerations

- GPT-4 costs ~$0.03 per 1K tokens
- Each analysis uses ~50-100 tokens
- Typical usage: $0.01-0.05 per workout session
- Monitor usage in OpenAI dashboard

## 🎯 Next Steps

1. Install the OpenAI package
2. Set your API key
3. Run the app and experience AI-powered coaching!
4. Customize prompts in `llm/openaiService.js` if needed

Your app now provides **real AI coaching** instead of rule-based feedback! 🎉
