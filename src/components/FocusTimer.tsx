import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Pause, RotateCcw, Timer, Coffee, Brain } from 'lucide-react';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const TIMER_LABELS = {
  focus: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const TIMER_ICONS = {
  focus: Brain,
  shortBreak: Coffee,
  longBreak: Timer,
};

const TIMER_COLORS = {
  focus: '#FFB3D9',
  shortBreak: '#B3D9FF',
  longBreak: '#FFF4B3',
};

export function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playCompletionSound();
            if (mode === 'focus') {
              setCompletedSessions((c) => c + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(TIMER_DURATIONS[mode]);
    setIsRunning(false);
  };

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100;
  const Icon = TIMER_ICONS[mode];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card 
        className="border-[5px] border-[#2C2C2C] bg-white relative overflow-hidden"
        style={{ 
          boxShadow: `8px 8px 0 0 ${TIMER_COLORS[mode]}, 8px 8px 0 5px #2C2C2C`
        }}
      >
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-2xl" style={{ color: '#2C2C2C' }}>
            <motion.div
              animate={isRunning ? { 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: isRunning ? Infinity : 0,
                repeatDelay: 2
              }}
            >
              <Icon className="w-7 h-7" strokeWidth={3} />
            </motion.div>
            Focus Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="flex gap-3">
            {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((timerMode) => (
              <Button
                key={timerMode}
                onClick={() => handleModeChange(timerMode)}
                className="flex-1 border-[3px] border-[#2C2C2C] transition-all duration-150"
                style={{
                  backgroundColor: mode === timerMode ? TIMER_COLORS[timerMode] : '#FFFFFF',
                  color: '#2C2C2C',
                  boxShadow: mode === timerMode ? '0 0 0 0 #2C2C2C' : '4px 4px 0 0 #2C2C2C',
                  transform: mode === timerMode ? 'translate(4px, 4px)' : 'translate(0, 0)',
                }}
              >
                {timerMode === 'focus' ? 'Focus' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </Button>
            ))}
          </div>

          <div className="text-center space-y-6 py-8">
            <motion.div 
              className="relative inline-block"
              animate={isRunning ? { 
                scale: [1, 1.02, 1],
              } : {}}
              transition={{ 
                duration: 1,
                repeat: isRunning ? Infinity : 0,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-block px-8 py-6 bg-white border-[5px] border-[#2C2C2C]"
                  style={{ 
                    boxShadow: `6px 6px 0 0 ${TIMER_COLORS[mode]}`,
                    fontFamily: 'Space Grotesk, monospace',
                    fontSize: '5rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: '#2C2C2C'
                  }}
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="space-y-2">
              <Progress 
                value={progress} 
                className="h-4 border-[3px] border-[#2C2C2C] bg-white"
                style={{
                  boxShadow: '3px 3px 0 0 #2C2C2C'
                }}
              />
              <p className="font-semibold text-lg" style={{ color: TIMER_COLORS[mode] }}>
                {TIMER_LABELS[mode]}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 border-[3px] border-[#2C2C2C] py-6"
              style={{
                backgroundColor: isRunning ? '#FFC4C4' : '#B3FFD9',
                color: '#2C2C2C',
                boxShadow: '5px 5px 0 0 #2C2C2C',
              }}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" strokeWidth={3} />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" strokeWidth={3} />
                  START
                </>
              )}
            </Button>
            <Button 
              onClick={handleReset} 
              className="border-[3px] border-[#2C2C2C] py-6 px-6"
              style={{
                backgroundColor: '#E6D5F5',
                color: '#2C2C2C',
                boxShadow: '5px 5px 0 0 #2C2C2C',
              }}
            >
              <RotateCcw className="w-5 h-5" strokeWidth={3} />
            </Button>
          </div>

          <motion.div 
            className="text-center pt-4 border-t-[3px] border-[#2C2C2C]"
            animate={{ scale: completedSessions > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-6 py-3 bg-[#FFF4B3] border-[3px] border-[#2C2C2C]"
              style={{ boxShadow: '4px 4px 0 0 #2C2C2C' }}
            >
              <p className="font-semibold" style={{ color: '#2C2C2C' }}>
                🏆 Completed sessions today: <span className="text-2xl ml-2">{completedSessions}</span>
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
