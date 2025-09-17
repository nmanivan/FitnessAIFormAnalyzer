import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMovementDetection, usePoseDetection, initializeTensorFlow } from './video/videoInput';
import { detectFitnessMovement, getFitnessTip } from './llm/llmArchitecture';
import { useAudioFeedback } from './audio/audioOutput';
import { getBasketballShootingTip, detectBasketballMovement, BASKETBALL_MOVEMENTS } from './basketball/basketballFormAnalyzer';
import styles from './styles/css/appStyles';

export default function App() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [movement, setMovement] = useState('idle');
  const [movementIntensity, setMovementIntensity] = useState(0);
  const [fitnessMove, setFitnessMove] = useState('none');
  const [lastSpokenTip, setLastSpokenTip] = useState('');
  const [currentTip, setCurrentTip] = useState('Get ready to start your workout!');
  const [movementHistory, setMovementHistory] = useState([]);
  const [tensorFlowReady, setTensorFlowReady] = useState(false);
  const [basketballMovement, setBasketballMovement] = useState(BASKETBALL_MOVEMENTS.SHOOTING);
  const [formScore, setFormScore] = useState(0);

  // Initialize TensorFlow on app start
  useEffect(() => {
    const initTF = async () => {
      const ready = await initializeTensorFlow();
      setTensorFlowReady(ready);
    };
    initTF();
  }, []);

  // AI-powered movement detection function
  const detectMovement = detectFitnessMovement(movementHistory, fitnessMove, setFitnessMove);

  // Video input/movement detection
  useMovementDetection(
    isAnalyzing,
    setMovement,
    setMovementIntensity,
    setMovementHistory,
    setFitnessMove,
    setLastSpokenTip,
    detectMovement
  );

  // Pose detection using MoveNet
  const { poseData, isDetectorReady } = usePoseDetection(isAnalyzing, cameraRef);

  // Optimized tip updates with immediate feedback and smart debouncing
  const tipUpdateTimeoutRef = useRef(null);
  const lastTipRef = useRef('');
  
  useEffect(() => {
    console.log('💡 [TIPS] Tip effect triggered - isAnalyzing:', isAnalyzing, 'movement:', movement, 'fitnessMove:', fitnessMove, 'intensity:', movementIntensity);
    
    if (!isAnalyzing) {
      console.log('💡 [TIPS] Not analyzing - setting ready message');
      setCurrentTip('Get ready to start your workout!');
      lastTipRef.current = '';
      return;
    }
    
    // Immediate feedback for common movements
    const immediateTips = {
      'idle': 'Get ready! Position yourself properly.',
      'moving': 'Good tempo! Keep movements smooth.',
      'active': 'Great intensity! Keep your core engaged.',
      'explosive': 'Powerful movement! Focus on controlled landing.',
      'rhythmic': 'Perfect rhythm! Keep this tempo.',
      'sustained': 'Strong hold! Keep your form tight.',
      'controlled': 'Precise control! Move with intention.'
    };
    
    // Show immediate feedback first
    const immediateTip = immediateTips[movement] || immediateTips[fitnessMove] || 'Keep up the great work!';
    console.log('💡 [TIPS] Immediate tip selected:', immediateTip);
    
    if (immediateTip !== lastTipRef.current) {
      console.log('💡 [TIPS] Setting immediate tip:', immediateTip);
      setCurrentTip(immediateTip);
      lastTipRef.current = immediateTip;
    } else {
      console.log('💡 [TIPS] Immediate tip unchanged, skipping update');
    }
    
    // Then get AI-enhanced tip after a longer delay (only for significant movements)
    if (tipUpdateTimeoutRef.current) {
      console.log('💡 [TIPS] Clearing existing AI tip timeout');
      clearTimeout(tipUpdateTimeoutRef.current);
    }
    
    // Only call LLM for significant movements and after longer delay
    if (movementIntensity > 0.3 || fitnessMove !== 'none') {
      console.log('💡 [TIPS] Scheduling AI tip generation in 2 seconds (intensity:', movementIntensity, 'fitnessMove:', fitnessMove, ')');
      tipUpdateTimeoutRef.current = setTimeout(async () => {
        console.log('🤖 [AI] Starting AI tip generation...');
        try {
          // Always use basketball-specific analysis for this basketball app
          let aiTip;
          console.log('🏀 [BASKETBALL] Using basketball-specific analysis (pose keypoints:', poseData?.summary?.highConfidenceKeypoints || 0, ')');
          const basketballResult = await getBasketballShootingTip(poseData, movementIntensity, movementHistory, basketballMovement);
          aiTip = basketballResult.tip;
          setFormScore(basketballResult.formScore);
          
          // Update basketball movement type
          const detectedMovement = detectBasketballMovement(movementIntensity, movementHistory, poseData);
          if (detectedMovement !== basketballMovement) {
            console.log('🏀 [BASKETBALL] Movement type changed:', basketballMovement, '->', detectedMovement);
            setBasketballMovement(detectedMovement);
          }
          
          console.log('🤖 [AI] AI tip received:', aiTip);
          if (aiTip && aiTip !== immediateTip) {
            console.log('🤖 [AI] Setting AI tip:', aiTip);
            setCurrentTip(aiTip);
            lastTipRef.current = aiTip;
          } else {
            console.log('🤖 [AI] AI tip same as immediate tip, keeping current');
          }
        } catch (error) {
          console.log('🤖 [AI] AI tip generation error:', error);
          // Keep the immediate tip, don't change it
        }
      }, 2000); // 2 second delay for AI tips
    } else {
      console.log('💡 [TIPS] Movement not significant enough for AI tips (intensity:', movementIntensity, 'fitnessMove:', fitnessMove, ')');
    }
    
    return () => {
      if (tipUpdateTimeoutRef.current) {
        console.log('💡 [TIPS] Cleanup: clearing tip timeout');
        clearTimeout(tipUpdateTimeoutRef.current);
      }
    };
  }, [isAnalyzing, fitnessMove, movement, movementIntensity]);

  // Audio feedback
  useAudioFeedback(
    isAnalyzing,
    movement,
    fitnessMove,
    lastSpokenTip,
    setLastSpokenTip,
    async () => {
      // Use basketball-specific tips for audio feedback
      if (isAnalyzing && poseData) {
        try {
          const basketballResult = await getBasketballShootingTip(poseData, movementIntensity, movementHistory, basketballMovement);
          return basketballResult.tip;
        } catch (error) {
          console.log('🏀 [AUDIO] Basketball tip error, using fallback:', error);
          return getFitnessTip(fitnessMove, movement, poseData);
        }
      }
      return getFitnessTip(fitnessMove, movement, poseData);
    }
  );

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

  const handleStartAnalysis = () => {
    console.log('🚀 [START] User clicked Start Analysis button');
    console.log('🚀 [START] Setting isAnalyzing to true');
    setIsAnalyzing(true);
    console.log('🚀 [START] Analysis started successfully');
  };

  const handleStopAnalysis = () => {
    console.log('🛑 [STOP] User clicked Stop Analysis button');
    
    // Clear any pending tip updates
    if (tipUpdateTimeoutRef.current) {
      console.log('🛑 [STOP] Clearing pending tip timeout');
      clearTimeout(tipUpdateTimeoutRef.current);
      tipUpdateTimeoutRef.current = null;
    } else {
      console.log('🛑 [STOP] No pending tip timeout to clear');
    }
    
    // Immediate UI feedback
    console.log('🛑 [STOP] Setting immediate stop message');
    setCurrentTip('Analysis stopped. Great workout!');
    
    // Stop analysis with minimal delay
    console.log('🛑 [STOP] Setting isAnalyzing to false');
    setIsAnalyzing(false);
    console.log('🛑 [STOP] Analysis stopped successfully');
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={StyleSheet.absoluteFill} 
        facing={facing}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>💪 BasketballFormAnalyzer</Text>
        <Text style={styles.subtitle}>
          {!tensorFlowReady ? 'Initializing TensorFlow...' : 
           isAnalyzing ? 'Analyzing...' : 'Ready to analyze'}
        </Text>
        {isAnalyzing && (
          <View style={styles.movementInfo}>
            <View style={styles.movementRow}>
              <View style={[styles.movementDot, { backgroundColor: getMovementColor() }]} />
              <Text style={[styles.movementText, { color: getMovementColor() }]}> {movement.toUpperCase()} </Text>
            </View>
            {fitnessMove !== 'none' && (
              <View style={styles.fitnessMoveRow}>
                <View style={[styles.fitnessMoveDot, { backgroundColor: getFitnessMoveColor() }]} />
                <Text style={[styles.fitnessMoveText, { color: getFitnessMoveColor() }]}> {fitnessMove.toUpperCase()} </Text>
              </View>
            )}
            <Text style={styles.intensityText}> Intensity: {movementIntensity.toFixed(2)} </Text>
            <View style={styles.basketballInfo}>
              <Text style={styles.basketballText}>
                🏀 {basketballMovement.replace('_', ' ').toUpperCase()}
              </Text>
              {formScore > 0 && (
                <Text style={styles.formScoreText}>
                  Form Score: {formScore}/100
                </Text>
              )}
            </View>
            {isDetectorReady && (
              <Text style={styles.poseStatus}>🤖 Pose detection active</Text>
            )}
            <Text style={styles.tipText}>{currentTip}</Text>
            <Text style={styles.audioStatus}>🎧 Audio feedback active</Text>
          </View>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, isAnalyzing && styles.stopButton, !tensorFlowReady && styles.disabledButton]} 
            onPress={isAnalyzing ? handleStopAnalysis : handleStartAnalysis}
            disabled={!tensorFlowReady}
          >
            <Text style={styles.buttonText}>
              {!tensorFlowReady ? 'Initializing...' : 
               isAnalyzing ? 'Stop' : 'Start Analysis'}
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
