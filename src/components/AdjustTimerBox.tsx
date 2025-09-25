import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AdjustTimerBoxProps {
  timeRemaining: number;
  onAdjust: (minutes: number, isAdd: boolean) => void;
  onValidationError: () => void;
}

const AdjustTimerBox: React.FC<AdjustTimerBoxProps> = ({ timeRemaining, onAdjust, onValidationError }) => {
  const [adjustInput, setAdjustInput] = useState('5');

  const handleAdjust = (isAdd: boolean) => {
    const minutes = parseInt(adjustInput) || 0;
    if (minutes <= 0) return;

    if (isAdd) {
      onAdjust(minutes, true);
    } else {
      const secondsToReduce = minutes * 60;
      // Check if reduction leaves at least 1 minute
      if (timeRemaining - secondsToReduce < 60) {
        onValidationError();
      } else {
        onAdjust(minutes, false);
      }
    }
  };

  return (
    <div className="bg-navy p-6 rounded-2xl shadow-lg w-full mt-6">
      <h3 className="text-lg font-semibold font-poppins text-white text-center mb-4">
        Adjust Timer
      </h3>
      <div className="flex items-center justify-center mb-4">
        <input
          type="number"
          min="1"
          value={adjustInput}
          onChange={(e) => setAdjustInput(e.target.value)}
          className="w-24 p-3 text-center border border-slate bg-charcoal text-white rounded-lg font-poppins text-xl focus:outline-none focus:ring-2 focus:ring-mint"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => handleAdjust(false)}
          className="flex-1 bg-charcoal hover:bg-slate/80 text-white font-medium font-poppins py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <Minus size={20} />
          <span>Reduce</span>
        </button>
        <button
          onClick={() => handleAdjust(true)}
          className="flex-1 bg-mint hover:bg-mint/90 text-white font-medium font-poppins py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default AdjustTimerBox;
