export interface TimerDuration {
  hours: number;
  minutes: number;
}

export interface TimerAction {
  type: 'announcement' | 'alarm' | 'task';
  content?: string;
  taskType?: 'call' | 'whatsapp' | 'email' | 'website';
  taskTarget?: string;
}

export interface TimerState {
  duration: TimerDuration;
  action: TimerAction;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
}

export type Screen = 'splash' | 'welcome' | 'timer-selection' | 'task-selection' | 'review' | 'timer-running';

export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
