import React from 'react';
import { Clock, Bell, Volume2, Briefcase, CheckCircle2, Play } from 'lucide-react';
import { TimerDuration, TimerAction } from '../types';

interface ReviewSummaryCardProps {
  duration: TimerDuration;
  action: TimerAction;
  onStart: () => void;
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ duration, action, onStart }) => {
  const formatDuration = () => {
    const totalMinutes = duration.hours * 60 + duration.minutes;
    if (duration.hours > 0) {
      return `${duration.hours}h ${duration.minutes}m`;
    }
    return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
  };

  const getActionDetails = () => {
    switch (action.type) {
      case 'announcement':
        return { icon: <Volume2 size={20} className="text-slate" />, text: 'Announcement' };
      case 'alarm':
        return { icon: <Bell size={20} className="text-slate" />, text: 'Alarm' };
      case 'task':
        return { icon: <Briefcase size={20} className="text-slate" />, text: 'Automated Task' };
      default:
        return { icon: <Bell size={20} className="text-slate" />, text: 'Alarm' };
    }
  };

  const actionDetails = getActionDetails();

  return (
    <div className="bg-navy p-8 rounded-2xl shadow-lg w-full text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <CheckCircle2 size={28} className="text-mint" />
        <h2 className="text-2xl font-bold font-poppins text-white">
          Session Summary
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center space-x-3">
          <Clock size={20} className="text-slate" />
          <p className="text-lg font-poppins text-offwhite">
            <span className="font-semibold">Duration:</span> {formatDuration()}
          </p>
        </div>
        <div className="flex items-center justify-center space-x-3">
          {actionDetails.icon}
          <p className="text-lg font-poppins text-offwhite">
            <span className="font-semibold">Task:</span> {actionDetails.text}
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-mint hover:bg-mint/90 text-white font-bold font-poppins py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-3 text-lg shadow-lg transform hover:scale-105 motion-safe:active:scale-100"
      >
        <Play size={24} />
        <span>Start Timer Session</span>
      </button>
    </div>
  );
};

export default ReviewSummaryCard;
