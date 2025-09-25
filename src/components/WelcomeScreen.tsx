import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import Footer from './Footer';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-navy-gradient flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <div className="bg-offwhite p-6 rounded-2xl shadow-xl mb-8">
            <Clock size={48} className="text-navy mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-poppins text-navy">Kronaut</h1>
          </div>

          <h2 className="text-3xl font-bold font-poppins text-white mb-4">
            Welcome to Kronaut
          </h2>
          
          <p className="text-slate font-poppins text-lg mb-8">
            The Easy Timer
          </p>

          <div className="mb-6 p-4 bg-charcoal rounded-lg">
            <p className="text-sm text-offwhite font-poppins leading-relaxed">
              By clicking on enter and continuing to the next screen you agree to our{' '}
              <a href="#" className="text-mint underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-mint underline">Privacy Policy</a>.
            </p>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-mint hover:bg-mint/90 text-white font-medium font-poppins py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Enter</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WelcomeScreen;
