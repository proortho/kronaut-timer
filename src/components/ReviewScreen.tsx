import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import Overlay from './Overlay';
import ReviewSummaryCard from './ReviewSummaryCard';
import { TimerDuration, TimerAction } from '../types';

interface ReviewScreenProps {
  duration: TimerDuration;
  action: TimerAction;
  onStart: () => void;
  onStepClick: (step: 'time' | 'task' | 'review') => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({
  duration,
  action,
  onStart,
  onStepClick
}) => {
  const [showMissingFields, setShowMissingFields] = useState(false);

  const validateAndStart = () => {
    const totalMinutes = duration.hours * 60 + duration.minutes;
    
    if (totalMinutes < 1) {
      setShowMissingFields(true);
      return;
    }

    if (action.type !== 'alarm' && !action.content?.trim()) {
      setShowMissingFields(true);
      return;
    }

    onStart();
  };

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          <ReviewSummaryCard 
            duration={duration}
            action={action}
            onStart={validateAndStart}
          />
        </motion.div>
      </div>

      <Footer showNavigation currentStep="review" onStepClick={onStepClick} />

      <Overlay
        isOpen={showMissingFields}
        onClose={() => setShowMissingFields(false)}
        title="Missing Information"
      >
        <p className="text-slate font-poppins mb-4">
          Please ensure you have set a valid duration and action before starting the timer.
        </p>
        <button
          onClick={() => setShowMissingFields(false)}
          className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </Overlay>
    </div>
  );
};

export default ReviewScreen;
