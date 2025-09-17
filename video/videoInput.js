import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

// Initialize TensorFlow for React Native
export const initializeTensorFlow = async () => {
  try {
    // Wait for TensorFlow to be ready
    await tf.ready();
    console.log('TensorFlow.js is ready!');

    // Prefer React Native WebGL backend when available, else fallback to CPU
    const availableBackends = tf.backendNames ? tf.backendNames() : [];
    const preferredBackend = availableBackends.includes('rn-webgl') ? 'rn-webgl' : 'cpu';
    await tf.setBackend(preferredBackend);
    console.log(`TensorFlow backend set to ${preferredBackend}`);
    
    return true;
  } catch (error) {
    console.error('Error initializing TensorFlow:', error);
    return false;
  }
};

// Initialize TensorFlow.js backend for React Native
tf.ready().then(() => {
  console.log('TensorFlow.js backend ready');
});

export function useMovementDetection(isAnalyzing, setMovement, setMovementIntensity, setMovementHistory, setFitnessMove, setLastSpokenTip, detectFitnessMovement) {
  const lastAnalysisRef = useRef(0);
  const movementBufferRef = useRef([]);
  const analysisThrottleMs = 1000; // Increased to 1 second to reduce LLM calls
  const initialDelayRef = useRef(true);

  useEffect(() => {
    console.log('📱 [MOVEMENT] Movement detection effect triggered - isAnalyzing:', isAnalyzing);
    let subscription;
    if (isAnalyzing) {
      console.log('📱 [MOVEMENT] Starting accelerometer with 150ms interval');
      Accelerometer.setUpdateInterval(150); // Reduced frequency from 100ms to 150ms
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const intensity = Math.sqrt(x * x + y * y + z * z);
        const timestamp = Date.now();
        
        // Buffer movement data for batch processing
        movementBufferRef.current.push({ x, y, z, intensity, timestamp });
        
        // Update UI immediately for responsiveness
        setMovementIntensity(intensity);
        
        // Smart movement classification with hysteresis to prevent flickering
        setMovement(prevMovement => {
          let newMovement;
          if (intensity > 0.5) newMovement = 'active';
          else if (intensity > 0.25) newMovement = 'moving';
          else if (intensity < 0.15) newMovement = 'idle';
          else newMovement = prevMovement; // Keep current state to prevent flickering
          
          if (newMovement !== prevMovement) {
            console.log('📱 [MOVEMENT] Movement changed:', prevMovement, '->', newMovement, '(intensity:', intensity.toFixed(3), ')');
          }
          return newMovement;
        });
        
        // Throttled analysis to reduce LLM calls
        if (timestamp - lastAnalysisRef.current > analysisThrottleMs) {
          console.log('📱 [MOVEMENT] Throttle period reached, processing movement data');
          const recentData = movementBufferRef.current.slice(-10); // Last 10 readings
          setMovementHistory(prev => {
            const newHistory = [...prev, ...recentData];
            return newHistory.slice(-30); // Keep more history for better analysis
          });
          
          // Skip LLM analysis for first 3 seconds to avoid initial delay
          if (initialDelayRef.current) {
            console.log('📱 [MOVEMENT] Still in initial delay period, skipping LLM analysis');
            setTimeout(() => {
              console.log('📱 [MOVEMENT] Initial delay period ended, LLM analysis now enabled');
              initialDelayRef.current = false;
            }, 3000);
          }
          
          // Only analyze if we have significant movement AND past initial delay
          if (intensity > 0.2 && !initialDelayRef.current) {
            console.log('📱 [MOVEMENT] Calling detectFitnessMovement (intensity:', intensity.toFixed(3), ')');
            detectFitnessMovement(intensity, { x, y, z });
          } else if (intensity <= 0.2) {
            console.log('📱 [MOVEMENT] Movement too weak for analysis (intensity:', intensity.toFixed(3), ')');
          }
          
          lastAnalysisRef.current = timestamp;
          movementBufferRef.current = []; // Clear buffer
          console.log('📱 [MOVEMENT] Movement buffer cleared, next analysis in', analysisThrottleMs, 'ms');
        }
      });
      console.log('📱 [MOVEMENT] Accelerometer listener added successfully');
    } else {
      console.log('📱 [MOVEMENT] Stopping analysis - immediate cleanup');
      // Immediate cleanup for responsive stop
      setMovement('idle');
      setMovementIntensity(0);
      setFitnessMove('none');
      setLastSpokenTip('');
      console.log('📱 [MOVEMENT] Basic state reset complete');
      
      // Batch state updates to reduce re-renders
      setTimeout(() => {
        console.log('📱 [MOVEMENT] Batched cleanup - clearing history and buffers');
        setMovementHistory([]);
        movementBufferRef.current = [];
        initialDelayRef.current = true; // Reset initial delay for next session
        console.log('📱 [MOVEMENT] Full cleanup complete, ready for next session');
      }, 0);
    }
    return () => {
      if (subscription) {
        console.log('📱 [MOVEMENT] Removing accelerometer subscription');
        subscription.remove();
      }
    };
  }, [isAnalyzing]);
}

// Simplified pose detection hook (without MediaPipe dependency)
export function usePoseDetection(isAnalyzing, cameraRef) {
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [poseData, setPoseData] = useState(null);

  // Initialize simplified pose detection
  useEffect(() => {
    console.log('🎯 [POSE] Pose detection effect triggered - isAnalyzing:', isAnalyzing);
    
    const initializeDetector = async () => {
      console.log('🎯 [POSE] Starting simplified pose detection...');
      try {
        console.log('🎯 [POSE] Waiting for TensorFlow to be ready...');
        await tf.ready();
        console.log('🎯 [POSE] TensorFlow ready, setting up simplified detection...');
        
        // For now, we'll use a simplified approach that doesn't require MediaPipe
        setIsDetectorReady(true);
        console.log('🎯 [POSE] Simplified pose detection ready');
      } catch (error) {
        console.error('🎯 [POSE] Failed to initialize pose detection:', error);
        // Set as ready even if failed to avoid blocking the app
        setIsDetectorReady(true);
        console.log('🎯 [POSE] Set detector as ready despite error to avoid blocking');
      }
    };

    // Only initialize when analysis starts to reduce startup delay
    if (isAnalyzing) {
      console.log('🎯 [POSE] Analysis started, initializing detector...');
      initializeDetector();
    } else {
      console.log('🎯 [POSE] Analysis not active, skipping detector initialization');
    }
  }, [isAnalyzing]);

  // Optimized pose detection with adaptive frequency
  useEffect(() => {
    console.log('🎯 [POSE] Simplified pose detection loop triggered - isAnalyzing:', isAnalyzing, 'isDetectorReady:', isDetectorReady);
    
    let intervalId;
    let lastPoseTime = 0;
    let consecutiveFailures = 0;
    const maxFailures = 3;
    
    // Immediate cleanup when stopping analysis
    if (!isAnalyzing) {
      console.log('🎯 [POSE] Analysis stopped, clearing pose data');
      setPoseData(null);
      return;
    }
    
    if (isAnalyzing && isDetectorReady) {
      console.log('🎯 [POSE] Starting pose detection loop...');
      
      const runSimplifiedPoseDetection = async () => {
        try {
          const now = Date.now();
          
          // Run every 3 seconds for simplified analysis
          if (now - lastPoseTime < 3000) {
            console.log('🎯 [POSE] Skipping pose detection - too soon');
            return;
          }
          
          console.log('🎯 [POSE] Running simplified pose analysis...');
          
          // Create mock pose data based on movement patterns
          // This simulates pose detection without requiring MediaPipe
          const mockPoseData = {
            keypoints: [
              { x: 0.5, y: 0.2, confidence: 0.8 }, // Nose
              { x: 0.4, y: 0.3, confidence: 0.7 }, // Left shoulder
              { x: 0.6, y: 0.3, confidence: 0.7 }, // Right shoulder
              { x: 0.3, y: 0.5, confidence: 0.6 }, // Left elbow
              { x: 0.7, y: 0.5, confidence: 0.6 }, // Right elbow
              { x: 0.2, y: 0.7, confidence: 0.5 }, // Left wrist
              { x: 0.8, y: 0.7, confidence: 0.5 }, // Right wrist
            ],
            summary: {
              highConfidenceKeypoints: 7,
              totalKeypoints: 7
            }
          };
          
          console.log('🎯 [POSE] Mock pose data created with', mockPoseData.summary.highConfidenceKeypoints, 'keypoints');
          setPoseData(mockPoseData);
          
          lastPoseTime = now;
        } catch (error) {
          console.error('🎯 [POSE] Simplified pose detection error:', error);
        }
      };
      
      // Start with immediate detection, then use intervals
      runSimplifiedPoseDetection();
      intervalId = setInterval(runSimplifiedPoseDetection, 3000); // Every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [isAnalyzing, isDetectorReady]);

  return { poseData, isDetectorReady };
}

// Convert base64 JPEG to a Tensor3D using tf.decodeJpeg (React Native)
async function createImageTensorFromBase64(base64) {
  try {
    // Fast path: use atob if available
    let byteArray;
    if (typeof atob === 'function') {
      const binary = atob(base64);
      byteArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        byteArray[i] = binary.charCodeAt(i);
      }
    } else if (typeof Buffer !== 'undefined') {
      // Fallback: Buffer if polyfilled
      byteArray = Uint8Array.from(Buffer.from(base64, 'base64'));
    } else {
      // Last resort: fetch the data URI and read as array buffer
      const res = await fetch(`data:image/jpeg;base64,${base64}`);
      const buf = await res.arrayBuffer();
      byteArray = new Uint8Array(buf);
    }

    // Decode JPEG to Tensor3D [height, width, 3] using tfjs-react-native helper
    const imageTensor = decodeJpeg(byteArray, 3);
    return imageTensor;
  } catch (error) {
    console.error('Failed to create image tensor from base64:', error);
    return null;
  }
}

// Format pose keypoints for LLM input
export function formatPoseForLLM(poseData) {
  if (!poseData || !poseData.keypoints) {
    return null;
  }

  return {
    keypoints: poseData.keypoints,
    summary: poseData.summary
  };
}

// Export function to get current pose data for LLM
export function getCurrentPoseData(poseData) {
  return poseData;
}
