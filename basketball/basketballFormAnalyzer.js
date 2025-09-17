// Basketball-specific form analysis
import { analyzeMovementWithLLM, generateLLMTip, analyzePoseWithLLM } from '../llm/openaiClient';

// Basketball shooting phases
export const SHOOTING_PHASES = {
  SETUP: 'setup',
  PREPARATION: 'preparation', 
  RELEASE: 'release',
  FOLLOW_THROUGH: 'follow_through',
  LANDING: 'landing'
};

// Basketball-specific keypoints for shooting form
export const BASKETBALL_KEYPOINTS = {
  // Upper body
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_PINKY: 11,
  RIGHT_PINKY: 12,
  LEFT_INDEX: 13,
  RIGHT_INDEX: 14,
  LEFT_THUMB: 15,
  RIGHT_THUMB: 16,
  
  // Lower body
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
};

// Analyze basketball shooting form from pose data
export function analyzeBasketballShootingForm(poseData, movementIntensity, movementHistory) {
  console.log('🏀 [BASKETBALL] Analyzing shooting form...');
  
  if (!poseData || !poseData.keypoints) {
    console.log('🏀 [BASKETBALL] No pose data available, using movement-based analysis');
    // Return basic analysis based on movement intensity
    return {
      phase: movementIntensity > 0.8 ? SHOOTING_PHASES.RELEASE : SHOOTING_PHASES.SETUP,
      formScore: Math.min(50, movementIntensity * 50), // Basic score based on movement
      feedback: ['Focus on your shooting form'],
      criticalIssues: ['Get in proper shooting position'],
      recommendations: ['Position yourself for a shot']
    };
  }

  const keypoints = poseData.keypoints;
  const analysis = {
    phase: detectShootingPhase(keypoints, movementIntensity, movementHistory),
    formScore: 0,
    feedback: [],
    criticalIssues: [],
    recommendations: []
  };

  // Analyze shooting stance
  const stanceAnalysis = analyzeShootingStance(keypoints);
  analysis.formScore += stanceAnalysis.score;
  analysis.feedback.push(...stanceAnalysis.feedback);
  analysis.criticalIssues.push(...stanceAnalysis.criticalIssues);

  // Analyze shooting mechanics
  const mechanicsAnalysis = analyzeShootingMechanics(keypoints, analysis.phase);
  analysis.formScore += mechanicsAnalysis.score;
  analysis.feedback.push(...mechanicsAnalysis.feedback);
  analysis.criticalIssues.push(...mechanicsAnalysis.criticalIssues);

  // Analyze follow-through
  const followThroughAnalysis = analyzeFollowThrough(keypoints, analysis.phase);
  analysis.formScore += followThroughAnalysis.score;
  analysis.feedback.push(...followThroughAnalysis.feedback);
  analysis.criticalIssues.push(...followThroughAnalysis.criticalIssues);

  // Generate recommendations
  analysis.recommendations = generateBasketballRecommendations(analysis);

  console.log('🏀 [BASKETBALL] Form analysis complete:', analysis);
  return analysis;
}

// Detect which phase of shooting the player is in
function detectShootingPhase(keypoints, movementIntensity, movementHistory) {
  console.log('🏀 [BASKETBALL] Detecting shooting phase...');
  
  // Analyze recent movement patterns
  const recentMovements = movementHistory.slice(-10);
  const avgIntensity = recentMovements.reduce((sum, m) => sum + m.intensity, 0) / recentMovements.length;
  
  // Get key shooting joints
  const rightWrist = keypoints[BASKETBALL_KEYPOINTS.RIGHT_WRIST];
  const rightElbow = keypoints[BASKETBALL_KEYPOINTS.RIGHT_ELBOW];
  const rightShoulder = keypoints[BASKETBALL_KEYPOINTS.RIGHT_SHOULDER];
  
  if (!rightWrist || !rightElbow || !rightShoulder) {
    return SHOOTING_PHASES.SETUP;
  }

  // Calculate shooting arm angles
  const elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const shoulderAngle = calculateAngle(rightElbow, rightShoulder, keypoints[BASKETBALL_KEYPOINTS.LEFT_SHOULDER]);
  
  // Phase detection logic
  if (movementIntensity < 0.3) {
    return SHOOTING_PHASES.SETUP;
  } else if (elbowAngle < 90 && shoulderAngle < 45) {
    return SHOOTING_PHASES.PREPARATION;
  } else if (elbowAngle > 90 && movementIntensity > 0.8) {
    return SHOOTING_PHASES.RELEASE;
  } else if (movementIntensity > 0.6 && avgIntensity > 0.5) {
    return SHOOTING_PHASES.FOLLOW_THROUGH;
  } else {
    return SHOOTING_PHASES.LANDING;
  }
}

// Analyze shooting stance
function analyzeShootingStance(keypoints) {
  console.log('🏀 [BASKETBALL] Analyzing shooting stance...');
  
  const analysis = {
    score: 0,
    feedback: [],
    criticalIssues: []
  };

  // Check foot positioning
  const leftFoot = keypoints[BASKETBALL_KEYPOINTS.LEFT_FOOT_INDEX];
  const rightFoot = keypoints[BASKETBALL_KEYPOINTS.RIGHT_FOOT_INDEX];
  const leftHip = keypoints[BASKETBALL_KEYPOINTS.LEFT_HIP];
  const rightHip = keypoints[BASKETBALL_KEYPOINTS.RIGHT_HIP];

  if (leftFoot && rightFoot && leftHip && rightHip) {
    // Check shoulder-width stance
    const footDistance = Math.abs(leftFoot.x - rightFoot.x);
    const hipDistance = Math.abs(leftHip.x - rightHip.x);
    const shoulderWidth = hipDistance * 1.2; // Approximate shoulder width

    if (Math.abs(footDistance - shoulderWidth) < shoulderWidth * 0.2) {
      analysis.score += 20;
      analysis.feedback.push("✅ Good shoulder-width stance");
    } else {
      analysis.criticalIssues.push("❌ Adjust foot positioning - aim for shoulder-width apart");
    }

    // Check if feet are pointing toward basket
    const leftFootAngle = Math.atan2(leftFoot.y - leftHip.y, leftFoot.x - leftHip.x);
    const rightFootAngle = Math.atan2(rightFoot.y - rightHip.y, rightFoot.x - rightHip.x);
    
    if (Math.abs(leftFootAngle - rightFootAngle) < 0.2) {
      analysis.score += 15;
      analysis.feedback.push("✅ Feet properly aligned");
    } else {
      analysis.criticalIssues.push("❌ Align feet toward the basket");
    }
  }

  // Check knee bend
  const leftKnee = keypoints[BASKETBALL_KEYPOINTS.LEFT_KNEE];
  const rightKnee = keypoints[BASKETBALL_KEYPOINTS.RIGHT_KNEE];
  
  if (leftKnee && rightKnee && leftHip && rightHip) {
    const leftKneeBend = calculateKneeBend(leftHip, leftKnee, keypoints[BASKETBALL_KEYPOINTS.LEFT_ANKLE]);
    const rightKneeBend = calculateKneeBend(rightHip, rightKnee, keypoints[BASKETBALL_KEYPOINTS.RIGHT_ANKLE]);
    
    if (leftKneeBend > 120 && rightKneeBend > 120) {
      analysis.score += 15;
      analysis.feedback.push("✅ Good knee bend for power");
    } else if (leftKneeBend < 90 || rightKneeBend < 90) {
      analysis.criticalIssues.push("❌ Bend knees more for better power and balance");
    }
  }

  return analysis;
}

// Analyze shooting mechanics
function analyzeShootingMechanics(keypoints, phase) {
  console.log('🏀 [BASKETBALL] Analyzing shooting mechanics for phase:', phase);
  
  const analysis = {
    score: 0,
    feedback: [],
    criticalIssues: []
  };

  const rightWrist = keypoints[BASKETBALL_KEYPOINTS.RIGHT_WRIST];
  const rightElbow = keypoints[BASKETBALL_KEYPOINTS.RIGHT_ELBOW];
  const rightShoulder = keypoints[BASKETBALL_KEYPOINTS.RIGHT_SHOULDER];
  const leftWrist = keypoints[BASKETBALL_KEYPOINTS.LEFT_WRIST];

  if (!rightWrist || !rightElbow || !rightShoulder) {
    return analysis;
  }

  // Check shooting arm alignment
  const elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  
  if (phase === SHOOTING_PHASES.PREPARATION || phase === SHOOTING_PHASES.RELEASE) {
    if (elbowAngle >= 80 && elbowAngle <= 100) {
      analysis.score += 25;
      analysis.feedback.push("✅ Perfect shooting arm angle (90°)");
    } else if (elbowAngle < 80) {
      analysis.criticalIssues.push("❌ Shooting arm too bent - extend more");
    } else {
      analysis.criticalIssues.push("❌ Shooting arm too straight - bend elbow to 90°");
    }
  }

  // Check shooting hand position
  if (leftWrist && rightWrist) {
    const handSeparation = Math.abs(leftWrist.x - rightWrist.x);
    const shoulderWidth = Math.abs(keypoints[BASKETBALL_KEYPOINTS.LEFT_SHOULDER].x - rightShoulder.x);
    
    if (handSeparation < shoulderWidth * 0.3) {
      analysis.score += 20;
      analysis.feedback.push("✅ Good hand positioning on ball");
    } else {
      analysis.criticalIssues.push("❌ Keep shooting hand centered on ball");
    }
  }

  // Check shooting line (elbow under ball)
  if (phase === SHOOTING_PHASES.RELEASE) {
    const elbowUnderBall = rightElbow.x < rightWrist.x + 20 && rightElbow.x > rightWrist.x - 20;
    if (elbowUnderBall) {
      analysis.score += 20;
      analysis.feedback.push("✅ Elbow properly aligned under ball");
    } else {
      analysis.criticalIssues.push("❌ Keep elbow directly under the ball");
    }
  }

  return analysis;
}

// Analyze follow-through
function analyzeFollowThrough(keypoints, phase) {
  console.log('🏀 [BASKETBALL] Analyzing follow-through for phase:', phase);
  
  const analysis = {
    score: 0,
    feedback: [],
    criticalIssues: []
  };

  if (phase !== SHOOTING_PHASES.FOLLOW_THROUGH) {
    return analysis;
  }

  const rightWrist = keypoints[BASKETBALL_KEYPOINTS.RIGHT_WRIST];
  const rightElbow = keypoints[BASKETBALL_KEYPOINTS.RIGHT_ELBOW];
  const rightIndex = keypoints[BASKETBALL_KEYPOINTS.RIGHT_INDEX];

  if (rightWrist && rightElbow && rightIndex) {
    // Check if wrist is snapped down (follow-through)
    const wristAngle = calculateAngle(rightElbow, rightWrist, rightIndex);
    
    if (wristAngle < 45) {
      analysis.score += 25;
      analysis.feedback.push("✅ Excellent follow-through with wrist snap");
    } else {
      analysis.criticalIssues.push("❌ Snap your wrist down on follow-through");
    }
  }

  return analysis;
}

// Generate basketball-specific recommendations
function generateBasketballRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.criticalIssues.length > 0) {
    recommendations.push("🎯 Focus on these critical areas:");
    analysis.criticalIssues.forEach(issue => {
      recommendations.push(`   ${issue}`);
    });
  }
  
  if (analysis.formScore < 50) {
    recommendations.push("💪 Practice basic shooting form before adding power");
  } else if (analysis.formScore < 80) {
    recommendations.push("🔥 Good foundation! Work on consistency");
  } else {
    recommendations.push("🏆 Excellent form! Keep practicing to maintain");
  }
  
  return recommendations;
}

// Utility functions
function calculateAngle(point1, point2, point3) {
  const a = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  const b = Math.sqrt(Math.pow(point3.x - point2.x, 2) + Math.pow(point3.y - point2.y, 2));
  const c = Math.sqrt(Math.pow(point1.x - point3.x, 2) + Math.pow(point1.y - point3.y, 2));
  
  return Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI);
}

function calculateKneeBend(hip, knee, ankle) {
  return calculateAngle(hip, knee, ankle);
}

// Basketball-specific LLM integration
export async function getBasketballShootingTip(poseData, movementIntensity, movementHistory, shootingPhase) {
  console.log('🏀 [BASKETBALL] Getting basketball-specific LLM tip...');
  
  try {
    // First get the form analysis
    const formAnalysis = analyzeBasketballShootingForm(poseData, movementIntensity, movementHistory);
    
    if (!formAnalysis) {
      return { tip: "Get in position and start your shooting motion!", formScore: 0 };
    }

    // Create basketball-specific prompt
    const basketballPrompt = createBasketballPrompt(formAnalysis, shootingPhase, movementIntensity);
    
    // Use basketball-specific LLM call
    const response = await generateBasketballLLMTip(basketballPrompt, formAnalysis, shootingPhase);
    
    console.log('🏀 [BASKETBALL] Basketball tip generated:', response, 'Form score:', formAnalysis.formScore);
    return { tip: response, formScore: formAnalysis.formScore };
    
  } catch (error) {
    console.log('🏀 [BASKETBALL] Error generating basketball tip:', error);
    const fallbackTip = getBasketballFallbackTip(shootingPhase, formAnalysis);
    return { tip: fallbackTip, formScore: formAnalysis?.formScore || 0 };
  }
}

// Create basketball-specific prompt for LLM
function createBasketballPrompt(formAnalysis, shootingPhase, movementIntensity) {
  return `You are a professional basketball shooting coach. Analyze this shooting form data:

Shooting Phase: ${shootingPhase}
Form Score: ${formAnalysis.formScore}/100
Critical Issues: ${formAnalysis.criticalIssues.join(', ')}
Movement Intensity: ${movementIntensity.toFixed(2)}

Provide specific, actionable feedback for improving basketball shooting form. Focus on:
1. Shooting mechanics
2. Body positioning
3. Follow-through technique
4. Power generation

Keep feedback concise (1-2 sentences) and encouraging.`;
}

// Enhance LLM response with basketball-specific feedback
function enhanceWithBasketballFeedback(llmResponse, formAnalysis) {
  if (formAnalysis.criticalIssues.length > 0) {
    const topIssue = formAnalysis.criticalIssues[0];
    return `${topIssue} ${llmResponse}`;
  }
  
  if (formAnalysis.feedback.length > 0) {
    const topFeedback = formAnalysis.feedback[0];
    return `${topFeedback} ${llmResponse}`;
  }
  
  return llmResponse;
}

// Basketball fallback tips
function getBasketballFallbackTip(shootingPhase, formAnalysis) {
  const fallbackTips = {
    [SHOOTING_PHASES.SETUP]: "🏀 Get in your shooting stance - feet shoulder-width apart, pointing toward the basket",
    [SHOOTING_PHASES.PREPARATION]: "🏀 Bend your knees and prepare to shoot - keep your shooting hand under the ball",
    [SHOOTING_PHASES.RELEASE]: "🏀 Release the ball with a smooth motion - elbow under the ball, snap your wrist",
    [SHOOTING_PHASES.FOLLOW_THROUGH]: "🏀 Follow through with your shooting hand - wrist should point down toward the basket",
    [SHOOTING_PHASES.LANDING]: "🏀 Land balanced and ready for the next shot - maintain good form throughout"
  };
  
  return fallbackTips[shootingPhase] || "🏀 Keep practicing your basketball shooting form!";
}

// Export basketball movement patterns
export const BASKETBALL_MOVEMENTS = {
  SHOOTING: 'shooting',
  DRIBBLING: 'dribbling', 
  PASSING: 'passing',
  REBOUNDING: 'rebounding',
  DEFENSIVE_STANCE: 'defensive_stance',
  CUTTING: 'cutting',
  JUMPING: 'jumping'
};

// Detect basketball movement type
export function detectBasketballMovement(movementIntensity, movementHistory, poseData) {
  console.log('🏀 [BASKETBALL] Detecting basketball movement type...');
  
  if (!movementHistory || movementHistory.length < 5) {
    return BASKETBALL_MOVEMENTS.SHOOTING; // Default to shooting
  }
  
  // Analyze movement patterns
  const recentMovements = movementHistory.slice(-10);
  const avgIntensity = recentMovements.reduce((sum, m) => sum + m.intensity, 0) / recentMovements.length;
  const intensityVariance = calculateVariance(recentMovements.map(m => m.intensity));
  
  // Movement detection logic
  if (movementIntensity > 1.5 && intensityVariance > 0.5) {
    return BASKETBALL_MOVEMENTS.JUMPING;
  } else if (movementIntensity > 1.0 && avgIntensity > 0.8) {
    return BASKETBALL_MOVEMENTS.DRIBBLING;
  } else if (movementIntensity > 0.8 && intensityVariance < 0.3) {
    return BASKETBALL_MOVEMENTS.SHOOTING;
  } else if (movementIntensity > 0.6) {
    return BASKETBALL_MOVEMENTS.PASSING;
  } else {
    return BASKETBALL_MOVEMENTS.DEFENSIVE_STANCE;
  }
}

function calculateVariance(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
}

// Basketball-specific LLM tip generation
async function generateBasketballLLMTip(basketballPrompt, formAnalysis, shootingPhase) {
  console.log('🏀 [BASKETBALL] Generating basketball-specific LLM tip...');
  
  try {
    // Create a basketball-specific prompt for the LLM
    const basketballSystemPrompt = `You are a professional basketball shooting coach. Provide specific, actionable feedback for basketball shooting form. Focus on:
- Shooting mechanics (stance, arm angle, follow-through)
- Ball positioning and release
- Body alignment and balance
- Shooting rhythm and timing

Current shooting phase: ${shootingPhase}
Form analysis: ${JSON.stringify(formAnalysis)}

Provide a concise, encouraging tip (1-2 sentences) that helps improve shooting form.`;

    // Use the existing LLM infrastructure with basketball-specific prompt
    const response = await generateLLMTip('basketball_shooting', 'active', null);
    
    // Enhance with basketball-specific feedback
    let basketballTip = response;
    
    if (formAnalysis.criticalIssues.length > 0) {
      const topIssue = formAnalysis.criticalIssues[0];
      basketballTip = `🏀 ${topIssue} ${response}`;
    } else if (formAnalysis.feedback.length > 0) {
      const topFeedback = formAnalysis.feedback[0];
      basketballTip = `🏀 ${topFeedback} ${response}`;
    } else {
      basketballTip = `🏀 ${response}`;
    }
    
    console.log('🏀 [BASKETBALL] Basketball LLM tip generated:', basketballTip);
    return basketballTip;
  } catch (error) {
    console.log('🏀 [BASKETBALL] Basketball LLM error:', error);
    // Return fallback basketball tip
    return getBasketballFallbackTip(shootingPhase, formAnalysis);
  }
}
