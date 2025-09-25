import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import Footer from './Footer';
import Overlay from './Overlay';
import { TimerAction } from '../types';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseTaskCommand } from '../utils/taskParser';

interface TaskSelectionScreenProps {
  action: TimerAction;
  onActionChange: (action: TimerAction) => void;
  onNext: () => void;
  onStepClick: (step: 'time' | 'task' | 'review') => void;
}

const TaskSelectionScreen: React.FC<TaskSelectionScreenProps> = ({
  action,
  onActionChange,
  onNext,
  onStepClick
}) => {
  const [textInput, setTextInput] = useState(action.content || '');
  const [showMicError, setShowMicError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const { isListening, transcript, error, startListening, stopListening, clearTranscript, clearError } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setTextInput(transcript);
      handleContentChange(transcript);
      clearTranscript();
    }
  }, [transcript]);

  useEffect(() => {
    if (error) {
      setShowMicError(true);
      clearError();
    }
  }, [error]);

  const actionTypes = [
    {
      type: 'announcement' as const,
      emoji: '📢',
      title: 'Announcement',
      description: 'Voice reminder with text-to-speech'
    },
    {
      type: 'alarm' as const,
      emoji: '⏰',
      title: 'Alarm',
      description: 'Simple alarm sound'
    },
    {
      type: 'task' as const,
      emoji: '✅',
      title: 'Task',
      description: 'Automated action (call, message, email)'
    }
  ];

  const handleTypeChange = (type: TimerAction['type']) => {
    onActionChange({ ...action, type, content: '' });
    setTextInput('');
  };

  const handleContentChange = (content: string) => {
    setTextInput(content);
    
    if (action.type === 'task') {
      const parsed = parseTaskCommand(content);
      onActionChange({
        ...action,
        content,
        taskType: parsed?.type,
        taskTarget: parsed?.target
      });
    } else {
      onActionChange({ ...action, content });
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const validateAndNext = () => {
    if (action.type === 'alarm') {
      onNext();
      return;
    }

    if (!action.content?.trim()) {
      setValidationMessage('Please enter content for your ' + action.type);
      setShowValidationError(true);
      return;
    }

    if (action.type === 'task') {
      const parsed = parseTaskCommand(action.content);
      if (!parsed) {
        setValidationMessage('Invalid task command. Try: "Call John", "WhatsApp Sarah", "Email Alex", or "Open google.com"');
        setShowValidationError(true);
        return;
      }
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
            Choose Action Type
          </h1>

          <div className="space-y-4 mb-8">
            {actionTypes.map((type) => (
              <motion.button
                key={type.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeChange(type.type)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  action.type === type.type
                    ? 'bg-mint text-white border-2 border-mint'
                    : 'bg-offwhite text-jetblack hover:bg-mint hover:text-white border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <h3 className="font-semibold font-poppins">{type.title}</h3>
                    <p className="text-sm opacity-75">{type.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {(action.type === 'announcement' || action.type === 'task') && (
            <div className="bg-offwhite p-6 rounded-xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold font-poppins text-jetblack">
                  {action.type === 'announcement' ? 'Reminder Text' : 'Task Command'}
                </h3>
                <button
                  onClick={handleVoiceToggle}
                  className={`p-2 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-error text-white' 
                      : 'bg-mint text-white hover:bg-mint/90'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={
                  action.type === 'announcement' 
                    ? 'Enter your reminder message...' 
                    : 'e.g., "Call John", "WhatsApp Sarah", "Email Alex"'
                }
                className="w-full p-3 border border-gray-300 rounded-lg font-poppins resize-none focus:outline-none focus:ring-2 focus:ring-mint"
                rows={3}
              />
              
              {action.type === 'task' && (
                <p className="text-xs text-slate mt-2">
                  Supported commands: Call, WhatsApp, Email, Open website
                </p>
              )}
            </div>
          )}

          <button
            onClick={validateAndNext}
            className="w-full bg-mint hover:bg-mint/90 text-white font-medium font-poppins py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <span>Confirm</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>

      <Footer showNavigation currentStep="task" onStepClick={onStepClick} />

      <Overlay
        isOpen={showMicError}
        onClose={() => setShowMicError(false)}
        title="Microphone Error"
      >
        <div className="flex items-start space-x-3 mb-4">
          <AlertCircle className="text-error mt-1" size={20} />
          <div>
            <p className="text-slate font-poppins mb-2">
              Unable to access microphone. Please:
            </p>
            <ul className="text-sm text-slate space-y-1 list-disc list-inside">
              <li>Check browser permissions</li>
              <li>Ensure microphone is connected</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
        </div>
        <button
          onClick={() => setShowMicError(false)}
          className="w-full bg-mint text-white font-poppins py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </Overlay>

      <Overlay
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        title="Validation Error"
      >
        <p className="text-slate font-poppins mb-4">{validationMessage}</p>
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

export default TaskSelectionScreen;
