import { FocusTimer } from './components/FocusTimer';
import { TaskList } from './components/TaskList';
import { BrainDump } from './components/BrainDump';
import { TimeAwareness } from './components/TimeAwareness';
import { Brain, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-background" style={{ 
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(230, 213, 245, 0.15) 100px,
          rgba(230, 213, 245, 0.15) 200px
        )
      `
    }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="inline-block relative">
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles className="w-8 h-8 text-[#E6D5F5] fill-[#E6D5F5]" />
            </motion.div>
            
            <div 
              className="inline-flex items-center justify-center gap-4 px-8 py-4 bg-white border-[6px] border-[#2C2C2C] relative"
              style={{ 
                boxShadow: '12px 12px 0 0 #FFB3D9, 12px 12px 0 6px #2C2C2C'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Brain className="w-12 h-12 text-[#B3D9FF]" strokeWidth={3} />
              </motion.div>
              <div className="text-left">
                <h1 className="text-5xl tracking-tight" style={{ fontFamily: 'Fredoka, sans-serif', color: '#2C2C2C' }}>
                  ADHD FOCUS HUB
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-5 h-5 text-[#FFF4B3] fill-[#FFF4B3]" />
                  <p className="text-lg font-semibold" style={{ color: '#FFB3D9' }}>
                    Stay focused & organized!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          >
            <FocusTimer />
            <TaskList />
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="space-y-8"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
          >
            <TimeAwareness />
            <BrainDump />
          </motion.div>
        </div>

        {/* Footer Tips */}
        <motion.div 
          className="mt-12 p-6 bg-[#FFF4B3] border-[5px] border-[#2C2C2C] relative overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ 
            boxShadow: '8px 8px 0 0 #2C2C2C'
          }}
        >
          <motion.div
            className="absolute top-0 right-0 text-[120px] opacity-10 select-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            💡
          </motion.div>
          <p className="text-base font-semibold text-[#2C2C2C] text-center relative z-10">
            <span className="inline-block px-3 py-1 bg-[#2C2C2C] text-white mr-2">
              💡 QUICK TIPS
            </span>
            Use the Focus Timer for 25-minute work sessions. 
            Capture tasks immediately when they pop into your head. 
            Brain Dump helps clear mental clutter!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
