import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="bg-offwhite p-8 rounded-2xl shadow-2xl">
          <Clock size={64} className="text-navy mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-poppins text-navy">Kronaut</h1>
          <p className="text-slate font-poppins mt-2">The Easy Timer</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
