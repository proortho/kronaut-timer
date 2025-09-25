import React from 'react';

interface FooterProps {
  showNavigation?: boolean;
  currentStep?: 'time' | 'task' | 'review';
  onStepClick?: (step: 'time' | 'task' | 'review') => void;
}

const Footer: React.FC<FooterProps> = ({ showNavigation = false, currentStep, onStepClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-navy p-4 text-center">
      {showNavigation && (
        <div className="flex justify-center space-x-6 mb-3">
          {['time', 'task', 'review'].map((step) => (
            <button
              key={step}
              onClick={() => onStepClick?.(step as 'time' | 'task' | 'review')}
              className={`px-4 py-2 rounded-lg font-poppins font-medium transition-colors ${
                currentStep === step
                  ? 'bg-mint text-white'
                  : 'bg-charcoal text-offwhite hover:bg-mint hover:text-white'
              }`}
            >
              {step === 'time' ? 'Time' : step === 'task' ? 'Task' : 'Review'}
            </button>
          ))}
        </div>
      )}
      
      <p className="text-offwhite text-sm font-poppins">
        © 2025 Joshi Associates. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
