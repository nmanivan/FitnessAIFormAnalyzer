import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Accelerometer } from 'expo-sensors';
import * as Speech from 'expo-speech';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [movement, setMovement] = useState('idle');
  const [movementIntensity, setMovementIntensity] = useState(0);
  const [fitnessMove, setFitnessMove] = useState('none');
  const [lastSpokenTip, setLastSpokenTip] = useState('');
  const [movementHistory, setMovementHistory] = useState([]);

  // Fitness movement detection with pattern recognition
  useEffect(() => {
    let subscription;
    if (isAnalyzing) {
      Accelerometer.setUpdateInterval(100); // Higher frequency for better pattern detection
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const intensity = Math.sqrt(x * x + y * y + z * z);
        setMovementIntensity(intensity);
        
        // Update movement history for pattern recognition
        setMovementHistory(prev => {
          const newHistory = [...prev, { x, y, z, intensity, timestamp: Date.now() }];
          // Keep last 20 readings (2 seconds at 100ms intervals)
          return newHistory.slice(-20);
        });
        
        // Basic movement classification
        if (intensity > 0.4) {
          setMovement('active');
        } else if (intensity > 0.2) {
          setMovement('moving');
        } else {
          setMovement('idle');
        }
        
        // Detect fitness-specific movements
        detectFitnessMovement(intensity, { x, y, z });
      });
    } else {
      setMovement('idle');
      setMovementIntensity(0);
      setFitnessMove('none');
      setLastSpokenTip('');
      setMovementHistory([]);
    }
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isAnalyzing]);

  // Fitness movement detection algorithm
  const detectFitnessMovement = (intensity, { x, y, z }) => {
    if (movementHistory.length < 10) return; // Need enough data
    
    const recent = movementHistory.slice(-10);
    const avgIntensity = recent.reduce((sum, reading) => sum + reading.intensity, 0) / recent.length;
    const variance = recent.reduce((sum, reading) => sum + Math.pow(reading.intensity - avgIntensity, 2), 0) / recent.length;
    
    // Detect explosive movements (jumping, burpees, etc.)
    if (z > 0.3 && intensity > 0.5 && variance > 0.1) {
      setFitnessMove('explosive');
      return;
    }
    
    // Detect rhythmic movements (running, cycling, etc.)
    if (Math.abs(y) > 0.2 && variance < 0.05 && recent.length >= 8) {
      const rhythmicPattern = recent.slice(-8).map((r, i) => 
        i % 2 === 0 ? r.y > 0 : r.y < 0
      );
      if (rhythmicPattern.every(Boolean)) {
        setFitnessMove('rhythmic');
        return;
      }
    }
    
    // Detect sustained movements (planks, holds, etc.)
    if (z > 0.4 && avgIntensity > 0.6) {
      setFitnessMove('sustained');
      return;
    }
    
    // Detect controlled movements (yoga, stretching, etc.)
    if (intensity < 0.3 && variance < 0.02 && Math.abs(x) < 0.1) {
      setFitnessMove('controlled');
      return;
    }
    
    // Reset if no specific movement detected
    if (fitnessMove !== 'none') {
      setFitnessMove('none');
    }
  };

  // Audio feedback system with fitness-specific tips
  useEffect(() => {
    if (isAnalyzing && (movement !== 'idle' || fitnessMove !== 'none')) {
      const tip = getFitnessTip();
      
      if (tip !== lastSpokenTip) {
        const speakTip = () => {
          Speech.speak(tip, {
            rate: 0.9,
            pitch: 1.0,
            language: 'en-US'
          });
          setLastSpokenTip(tip);
        };

        const timer = setTimeout(speakTip, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAnalyzing, movement, fitnessMove, lastSpokenTip]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>💪 BasketballFormAnalyzer</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>💪 BasketballFormAnalyzer</Text>
        <Text style={styles.subtitle}>Camera permission needed</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getMovementColor = () => {
    switch (movement) {
      case 'active': return '#22c55e';
      case 'moving': return '#f59e0b';
      case 'idle': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getFitnessMoveColor = () => {
    switch (fitnessMove) {
      case 'explosive': return '#ef4444';
      case 'rhythmic': return '#8b5cf6';
      case 'sustained': return '#06b6d4';
      case 'controlled': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getFitnessTip = () => {
    if (fitnessMove !== 'none') {
      const fitnessTips = {
        explosive: [
          'Great explosive power! Land softly and maintain control.',
          'Excellent burst! Keep your core engaged throughout.',
          'Strong movement! Focus on proper landing form.',
          'Perfect power! Control your momentum.'
        ],
        rhythmic: [
          'Good rhythm! Maintain consistent tempo.',
          'Nice cadence! Keep your movements smooth.',
          'Great flow! Stay in your rhythm zone.',
          'Good pace! Focus on steady breathing.'
        ],
        sustained: [
          'Strong hold! Keep your form tight.',
          'Great endurance! Maintain proper alignment.',
          'Perfect stability! Control your breathing.',
          'Excellent control! Stay focused on form.'
        ],
        controlled: [
          'Perfect control! Move with intention.',
          'Great precision! Focus on alignment.',
          'Excellent form! Keep movements deliberate.',
          'Nice control! Maintain awareness.'
        ]
      };
      
      const tipArray = fitnessTips[fitnessMove];
      return tipArray[Math.floor(Math.random() * tipArray.length)];
    }
    
    // Fallback to general movement tips
    const generalTips = {
      active: [
        'Great intensity! Keep your core engaged and finish strong.',
        'Excellent power! Control your movements throughout.',
        'Strong energy! Stay balanced and controlled.'
      ],
      moving: [
        'Good tempo. Bend your knees and stay light on your feet.',
        'Nice movement. Keep your shoulders relaxed and balanced.',
        'Good pace. Focus on smooth, controlled motion.'
      ],
      idle: [
        'Get ready. Position yourself for the exercise.',
        'Set your stance. Feet shoulder-width, knees slightly bent.',
        'Stay ready. Maintain good posture and breathing.'
      ]
    };
    
    const tipArray = generalTips[movement] || generalTips.idle;
    return tipArray[Math.floor(Math.random() * tipArray.length)];
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    Speech.speak('Starting fitness form analysis. Position yourself in the camera view.', {
      rate: 0.9,
      pitch: 1.0
    });
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    Speech.speak('Analysis stopped. Great work today!', {
      rate: 0.9,
      pitch: 1.0
    });
    Speech.stop();
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing={facing}
      />
      
      <View style={styles.overlay}>
        <Text style={styles.title}>💪 BasketballFormAnalyzer</Text>
        <Text style={styles.subtitle}>
          {isAnalyzing ? 'Analyzing...' : 'Ready to analyze'}
        </Text>
        
        {isAnalyzing && (
          <View style={styles.movementInfo}>
            <View style={styles.movementRow}>
              <View style={[styles.movementDot, { backgroundColor: getMovementColor() }]} />
              <Text style={[styles.movementText, { color: getMovementColor() }]}>
                {movement.toUpperCase()}
              </Text>
            </View>
            
            {fitnessMove !== 'none' && (
              <View style={styles.fitnessMoveRow}>
                <View style={[styles.fitnessMoveDot, { backgroundColor: getFitnessMoveColor() }]} />
                <Text style={[styles.fitnessMoveText, { color: getFitnessMoveColor() }]}>
                  {fitnessMove.toUpperCase()}
                </Text>
              </View>
            )}
            
            <Text style={styles.intensityText}>
              Intensity: {movementIntensity.toFixed(2)}
            </Text>
            <Text style={styles.tipText}>{getFitnessTip()}</Text>
            <Text style={styles.audioStatus}>🎧 Audio feedback active</Text>
          </View>
        )}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, isAnalyzing && styles.stopButton]} 
            onPress={isAnalyzing ? handleStopAnalysis : handleStartAnalysis}
          >
            <Text style={styles.buttonText}>
              {isAnalyzing ? 'Stop' : 'Start Analysis'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.switchText}>Switch Camera</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.status}>
          Status: {isAnalyzing ? 'Analyzing' : 'Ready'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  movementInfo: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    minWidth: 280,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fitnessMoveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  fitnessMoveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  movementText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fitnessMoveText: {
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  intensityText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tipText: {
    color: '#93c5fd',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  audioStatus: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  switchButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
