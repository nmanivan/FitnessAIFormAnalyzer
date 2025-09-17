import { useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';

// Simple hook to provide spoken feedback when a new tip is available
// It speaks only when analyzing and when the generated tip changes
export function useAudioFeedback(
  isAnalyzing,
  movement,
  fitnessMove,
  lastSpokenTip,
  setLastSpokenTip,
  getTip
) {
  const lastSpokenAtRef = useRef(0);
  const lastMovementRef = useRef('');
  const lastFitnessMoveRef = useRef('');
  const minSpeakIntervalMs = 3000; // Increased throttle to 3 seconds
  const significantChangeThreshold = 0.3; // Only speak on significant changes

  useEffect(() => {
    console.log('🔊 [AUDIO] Audio feedback effect triggered - isAnalyzing:', isAnalyzing, 'movement:', movement, 'fitnessMove:', fitnessMove);
    
    if (!isAnalyzing) {
      console.log('🔊 [AUDIO] Not analyzing, skipping audio feedback');
      return;
    }

    const trySpeak = async () => {
      try {
        const now = Date.now();
        
        // Check if enough time has passed
        if (now - lastSpokenAtRef.current < minSpeakIntervalMs) {
          console.log('🔊 [AUDIO] Too soon to speak again (interval:', minSpeakIntervalMs, 'ms)');
          return;
        }
        
        console.log('🔊 [AUDIO] Attempting to speak feedback...');
        
        // Check if there's been a significant change in movement
        const movementChanged = movement !== lastMovementRef.current;
        const fitnessMoveChanged = fitnessMove !== lastFitnessMoveRef.current;
        
        console.log('🔊 [AUDIO] Movement changed:', movementChanged, 'Fitness move changed:', fitnessMoveChanged);
        
        if (!movementChanged && !fitnessMoveChanged) {
          console.log('🔊 [AUDIO] No significant change, skipping speech');
          return; // No significant change, don't speak
        }

        console.log('🔊 [AUDIO] Getting tip for speech...');
        const tip = typeof getTip === 'function' ? await getTip() : '';
        console.log('🔊 [AUDIO] Tip received:', tip, 'length:', tip?.length || 0);
        
        if (tip && tip !== lastSpokenTip && tip.length > 10) { // Only speak meaningful tips
          console.log('🔊 [AUDIO] Speaking tip:', tip);
          // Stop any ongoing speech and speak the new tip
          Speech.stop();
          Speech.speak(tip, { 
            language: 'en-US', 
            rate: 0.9, // Slightly slower for clarity
            pitch: 1.0,
            volume: 0.8 // Slightly quieter
          });
          setLastSpokenTip(tip);
          lastSpokenAtRef.current = now;
          lastMovementRef.current = movement;
          lastFitnessMoveRef.current = fitnessMove;
          console.log('🔊 [AUDIO] Speech started successfully');
        } else {
          console.log('🔊 [AUDIO] Tip not suitable for speech (same as last or too short)');
        }
      } catch (error) {
        // Fail silently; audio feedback is auxiliary
        console.warn('Audio feedback error:', error);
      }
    };

    // Only try to speak if there's been a meaningful change
    if (movement !== lastMovementRef.current || fitnessMove !== lastFitnessMoveRef.current) {
      trySpeak();
    }
  }, [isAnalyzing, movement, fitnessMove, getTip, lastSpokenTip, setLastSpokenTip]);
}

export default useAudioFeedback;
