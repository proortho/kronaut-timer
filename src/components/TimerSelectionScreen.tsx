import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Footer from './Footer';
import Overlay from './Overlay';
import { TimerDuration } from '../types';

interface TimerSelectionScreenProps {
  duration: TimerDuration;
  onDurationChange: (duration: TimerDuration) => void;
  onNext: () => void;
  onStepClick: (step: 'time' | 'task' | 'review') => void;
}

const TimerSelectionScreen: React.FC<TimerSelectionScreenProps> = ({
  duration,
  onDurationChange,
  onNext,
  onStepClick
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customHours, setCustomHours] = useState(duration.hours.toString());
  const [customMinutes, setCustomMinutes] = useState(duration.minutes.toString());
  const [showValidationError, setShowValidationError] = useState(false);

  const presets = [
    { minutes: 5, emoji: '⏰', label: '5 min' },
    { minutes: 10, emoji: '🕙', label: '10 min' },
    { minutes: 15, emoji: '🕒', label: '15 min' },
    { minutes: 20, emoji: '🕓', label: '20 min' },
    { minutes: 30, emoji: '🕞', label: '30 min' }
  ];

  const handlePresetClick = (minutes: number, index: number) => {
    setSelectedPreset(index);
    onDurationChange({ hours: 0, minutes });
    setCustomHours('0');
    setCustomMinutes(minutes.toString());
  };

  const handleCustomChange = () => {
    const hours = parseInt(customHours) || 0;
    const minutes = parseInt(customMinutes) || 0;
    
    if (hours === 0 && minutes === 0) {
      setSelectedPreset(null);
      return;
    }
    
    setSelectedPreset(null);
    onDurationChange({ hours, minutes });
  };

  const validateAndNext = () => {
    const totalMinutes = duration.hours * 60 + duration.minutes;
    if (totalMinutes < 1) {
      setShowValidationError(true);
      return;
    }
    onNext();
  };

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <div className="flex-1 p-6 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-2xl font-bold font-poppins text-white mb-8 text-center">
            Set Timer Duration
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {presets.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePresetClick(preset.minutes, index)}
                className={`p-4 rounded-xl font-poppins font-medium transition-all ${
                  selectedPreset === index
                    ? 'bg-mint text-white border-2 border-mint'
                    : 'bg-offwhite text-jetblack hover:bg-mint hover:text-white border-2 border-transparent'
                }`}
              >
                <div className="text-2xl mb-2">{preset.emoji}</div>
                <div>{preset.label}</div>
              </motion.button>
            ))}
          </div>

          <div className="bg-offwhite p-6 rounded-xl mb-8">
            <h3 className="font-semibold font-poppins text-jetblack mb-4">Custom Duration</h3>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-poppins text-slate mb-2">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={customHours}
                  onChange={(e) => {
                    setCustomHours(e.target.value);
                    handleCustomChange();
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-mint"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-poppins text-slate mb-2">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value);
                    handleCustomChange();
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-mint"
                />
              </div>
            </div>
          </div>

          <button
            onClick={validateAndNext}
            className="w-full bg-mint hover:bg-mint/90 text-white font-medium font-poppins py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>

      <Footer showNavigation currentStep="time" onStepClick={onStepClick} />

      <Overlay
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        title="Invalid Duration"
      >
        <p className="text-slate font-poppins mb-4">
          Please set a timer duration of at least 1 minute.
        </p>
        <button
          onClick={() => setShowValidationError(false)}
          className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </Overlay>
    </div>
  );
};

export default TimerSelectionScreen;
