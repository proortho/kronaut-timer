import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import TimerSelectionScreen from './components/TimerSelectionScreen';
import TaskSelectionScreen from './components/TaskSelectionScreen';
import ReviewScreen from './components/ReviewScreen';
import TimerRunningScreen from './components/TimerRunningScreen';
import { useNotifications } from './hooks/useNotifications';
import { Screen, TimerDuration, TimerAction, TimerState } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [timerDuration, setTimerDuration] = useState<TimerDuration>({ hours: 0, minutes: 5 });
  const [timerAction, setTimerAction] = useState<TimerAction>({ type: 'alarm' });
  const [timerState, setTimerState] = useState<TimerState>({
    duration: { hours: 0, minutes: 5 },
    action: { type: 'alarm' },
    timeRemaining: 300,
    isRunning: false,
    isPaused: false
  });

  const { requestPermission } = useNotifications();

  useEffect(() => {
    // Request notification permission on app load
    requestPermission();
  }, [requestPermission]);

  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleStepNavigation = (step: 'time' | 'task' | 'review') => {
    switch (step) {
      case 'time':
        setCurrentScreen('timer-selection');
        break;
      case 'task':
        setCurrentScreen('task-selection');
        break;
      case 'review':
        setCurrentScreen('review');
        break;
    }
  };

  const handleStartTimer = () => {
    const totalSeconds = (timerDuration.hours * 3600) + (timerDuration.minutes * 60);
    setTimerState({
      duration: timerDuration,
      action: timerAction,
      timeRemaining: totalSeconds,
      isRunning: true,
      isPaused: false
    });
    setCurrentScreen('timer-running');
  };

  const handleTimerUpdate = (updates: Partial<TimerState>) => {
    setTimerState(prev => ({ ...prev, ...updates }));
  };

  const handleTimerComplete = () => {
    setCurrentScreen('timer-selection');
    // Reset to defaults
    setTimerDuration({ hours: 0, minutes: 5 });
    setTimerAction({ type: 'alarm' });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => handleScreenTransition('welcome')} />;
      
      case 'welcome':
        return <WelcomeScreen onNext={() => handleScreenTransition('timer-selection')} />;
      
      case 'timer-selection':
        return (
          <TimerSelectionScreen
            duration={timerDuration}
            onDurationChange={setTimerDuration}
            onNext={() => handleScreenTransition('task-selection')}
            onStepClick={handleStepNavigation}
          />
        );
      
      case 'task-selection':
        return (
          <TaskSelectionScreen
            action={timerAction}
            onActionChange={setTimerAction}
            onNext={() => handleScreenTransition('review')}
            onStepClick={handleStepNavigation}
          />
        );
      
      case 'review':
        return (
          <ReviewScreen
            duration={timerDuration}
            action={timerAction}
            onStart={handleStartTimer}
            onStepClick={handleStepNavigation}
          />
        );
      
      case 'timer-running':
        return (
          <TimerRunningScreen
            timerState={timerState}
            onTimerUpdate={handleTimerUpdate}
            onComplete={handleTimerComplete}
          />
        );
      
      default:
        return <SplashScreen onComplete={() => handleScreenTransition('welcome')} />;
    }
  };

  return (
    <div className="font-poppins">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
