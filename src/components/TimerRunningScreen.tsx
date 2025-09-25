import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Square, Volume2, AlertTriangle } from 'lucide-react';
import Footer from './Footer';
import Overlay from './Overlay';
import AdjustTimerBox from './AdjustTimerBox';
import { TimerState } from '../types';
import { useTTS } from '../hooks/useTTS';
import { useNotifications } from '../hooks/useNotifications';
import { generateDeepLink, parseTaskCommand } from '../utils/taskParser';

interface TimerRunningScreenProps {
  timerState: TimerState;
  onTimerUpdate: (state: Partial<TimerState>) => void;
  onComplete: () => void;
}

const TimerRunningScreen: React.FC<TimerRunningScreenProps> = ({
  timerState,
  onTimerUpdate,
  onComplete
}) => {
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showAlarmOverlay, setShowAlarmOverlay] = useState(false);
  const [showDeepLinkFallback, setShowDeepLinkFallback] = useState(false);
  const [showTtsError, setShowTtsError] = useState(false);
  const [showAdjustError, setShowAdjustError] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState('');

  const { speak, stop } = useTTS();
  const { showNotification } = useNotifications();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    const totalTime = (timerState.duration.hours * 3600) + (timerState.duration.minutes * 60);
    const progress = timerState.timeRemaining / totalTime;
    
    if (progress > 0.5) return '#50B699'; // mint
    if (progress > 0.2) return '#FFB020'; // amber
    return '#EC6B1A'; // orange
  };

  const circumference = 2 * Math.PI * 120;
  const totalTime = (timerState.duration.hours * 3600) + (timerState.duration.minutes * 60);
  const progress = totalTime > 0 ? timerState.timeRemaining / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const handlePause = () => {
    onTimerUpdate({ isPaused: !timerState.isPaused });
  };

  const handleStop = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    stop();
    setShowStopConfirm(false);
    onComplete();
  };

  const handleAdjustTimer = (minutes: number, isAdd: boolean) => {
    const secondsToChange = minutes * 60;
    if (isAdd) {
      onTimerUpdate({ timeRemaining: timerState.timeRemaining + secondsToChange });
    } else {
      onTimerUpdate({ timeRemaining: timerState.timeRemaining - secondsToChange });
    }
  };

  const handleTimerComplete = useCallback(() => {
    showNotification('Timer Completed!', {
      body: 'Your Kronaut timer has finished.',
      requireInteraction: true
    });

    switch (timerState.action.type) {
      case 'announcement':
        try {
          speak(timerState.action.content || 'Timer completed');
          setTimeout(() => {
            onComplete();
          }, 5000);
        } catch (error) {
          console.error("TTS failed:", error);
          setShowTtsError(true);
        }
        break;
        
      case 'alarm':
        setShowAlarmOverlay(true);
        break;
        
      case 'task':
        if (timerState.action.content) {
          const parsed = parseTaskCommand(timerState.action.content);
          if (parsed) {
            const url = generateDeepLink(parsed);
            setDeepLinkUrl(url);
            
            try {
              window.open(url, '_blank');
            } catch (error) {
              setShowDeepLinkFallback(true);
              return;
            }
          }
        }
        onComplete();
        break;
    }
  }, [timerState.action, speak, showNotification, onComplete]);

  useEffect(() => {
    if (!timerState.isRunning || timerState.isPaused) return;

    if (timerState.timeRemaining <= 0) {
      onTimerUpdate({ isRunning: false });
      handleTimerComplete();
      return;
    }

    const interval = setInterval(() => {
      onTimerUpdate({ timeRemaining: timerState.timeRemaining - 1 });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, timerState.timeRemaining, onTimerUpdate, handleTimerComplete]);

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full max-w-sm mx-auto"
        >
          <div className="relative mb-8 flex justify-center">
            <svg width="280" height="280" className="transform -rotate-90">
              <circle cx="140" cy="140" r="120" stroke="#2C2C34" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="140"
                cy="140"
                r="120"
                stroke={getProgressColor()}
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold font-poppins text-white mb-2">
                  {formatTime(timerState.timeRemaining)}
                </div>
                <div className="text-slate font-poppins">
                  {timerState.isPaused ? 'Paused' : 'Running'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mb-6">
            <button onClick={handlePause} className="bg-mint hover:bg-mint/90 text-white p-4 rounded-full transition-colors">
              {timerState.isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button onClick={handleStop} className="bg-error hover:bg-error/90 text-white p-4 rounded-full transition-colors">
              <Square size={24} />
            </button>
          </div>

          <AdjustTimerBox
            timeRemaining={timerState.timeRemaining}
            onAdjust={handleAdjustTimer}
            onValidationError={() => setShowAdjustError(true)}
          />
        </motion.div>
      </div>

      <Footer />

      <Overlay isOpen={showStopConfirm} onClose={() => setShowStopConfirm(false)} title="Stop Timer?">
        <p className="text-slate font-poppins mb-4">Are you sure you want to stop the timer? This action cannot be undone.</p>
        <div className="flex space-x-3">
          <button onClick={() => setShowStopConfirm(false)} className="flex-1 bg-charcoal text-white font-poppins py-2 px-4 rounded-lg">Cancel</button>
          <button onClick={confirmStop} className="flex-1 bg-error text-white font-poppins py-2 px-4 rounded-lg">Stop</button>
        </div>
      </Overlay>

      <Overlay isOpen={showAlarmOverlay} onClose={() => {}} title="⏰ Alarm">
        <div className="text-center mb-4">
          <Volume2 size={48} className="text-orange mx-auto mb-4" />
          <p className="text-slate font-poppins">Timer completed!</p>
        </div>
        <button onClick={() => { setShowAlarmOverlay(false); onComplete(); }} className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg">Stop Alarm</button>
      </Overlay>

      <Overlay isOpen={showDeepLinkFallback} onClose={() => setShowDeepLinkFallback(false)} title="Unable to Open Link">
        <p className="text-slate font-poppins mb-4">The link couldn't be opened automatically. You can:</p>
        <div className="space-y-2">
          <button onClick={() => window.open(deepLinkUrl, '_blank')} className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg">Try Opening Again</button>
          <button onClick={() => navigator.clipboard.writeText(deepLinkUrl)} className="w-full bg-charcoal text-white font-poppins py-2 px-4 rounded-lg">Copy Link</button>
          <button onClick={() => { setShowDeepLinkFallback(false); onComplete(); }} className="w-full bg-slate text-white font-poppins py-2 px-4 rounded-lg">Cancel</button>
        </div>
      </Overlay>
      
      <Overlay isOpen={showTtsError} onClose={() => { setShowTtsError(false); onComplete(); }} title="Audio Playback Error">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle size={24} className="text-error" />
          <p className="text-slate font-poppins">Could not play the announcement audio. Please check your browser settings.</p>
        </div>
        <button onClick={() => { setShowTtsError(false); onComplete(); }} className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg">OK</button>
      </Overlay>

      <Overlay
        isOpen={showAdjustError}
        onClose={() => setShowAdjustError(false)}
        title="Invalid Adjustment"
      >
        <div className="text-center">
          <AlertTriangle size={40} className="text-orange mx-auto mb-4" />
          <p className="text-slate font-poppins mb-4">
            ⛔ You cannot reduce the timer to less than 1 minute.
          </p>
        </div>
        <button
          onClick={() => setShowAdjustError(false)}
          className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </Overlay>
    </div>
  );
};

export default TimerRunningScreen;
