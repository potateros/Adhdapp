import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Clock, Sun, Moon, Sunset, Sunrise } from 'lucide-react';
import { motion } from 'motion/react';

export function TimeAwareness() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dayProgress = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 100;

  const getTimeOfDay = () => {
    if (hours < 6) return { label: 'Night', icon: Moon, color: '#E6D5F5' };
    if (hours < 12) return { label: 'Morning', icon: Sunrise, color: '#FFE1E9' };
    if (hours < 17) return { label: 'Afternoon', icon: Sun, color: '#FFF4B3' };
    if (hours < 21) return { label: 'Evening', icon: Sunset, color: '#FFD4B2' };
    return { label: 'Night', icon: Moon, color: '#E6D5F5' };
  };

  const timeOfDay = getTimeOfDay();
  const TimeIcon = timeOfDay.icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
    >
      <Card 
        className="border-[5px] border-[#2C2C2C] bg-white relative overflow-hidden"
        style={{ 
          boxShadow: `8px 8px 0 0 ${timeOfDay.color}, 8px 8px 0 5px #2C2C2C`
        }}
      >
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="p-3 border-[3px] border-[#2C2C2C]"
              style={{ 
                backgroundColor: timeOfDay.color,
                boxShadow: '4px 4px 0 0 #2C2C2C'
              }}
            >
              <TimeIcon className="w-8 h-8 text-[#2C2C2C]" strokeWidth={3} />
            </motion.div>
            <div>
              <div className="inline-block px-3 py-1 bg-[#2C2C2C] text-white border-[3px] border-[#2C2C2C] mb-2"
                style={{ boxShadow: '3px 3px 0 0 ' + timeOfDay.color }}
              >
                <p className="font-semibold text-sm">{timeOfDay.label.toUpperCase()}</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{dateString}</p>
            </div>
          </div>

          <motion.div 
            className="mb-6 p-6 border-[4px] border-[#2C2C2C] bg-white relative"
            style={{ 
              boxShadow: '6px 6px 0 0 ' + timeOfDay.color,
            }}
            animate={{ 
              boxShadow: [
                `6px 6px 0 0 ${timeOfDay.color}`,
                `8px 8px 0 0 ${timeOfDay.color}`,
                `6px 6px 0 0 ${timeOfDay.color}`,
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              key={seconds}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center"
              style={{ 
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '3rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#2C2C2C'
              }}
            >
              {timeString}
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" strokeWidth={3} style={{ color: '#2C2C2C' }} />
                <span className="font-semibold" style={{ color: '#2C2C2C' }}>Day Progress</span>
              </div>
              <div 
                className="px-3 py-1 border-[2px] border-[#2C2C2C] font-semibold"
                style={{ 
                  backgroundColor: timeOfDay.color,
                  boxShadow: '2px 2px 0 0 #2C2C2C',
                  color: '#2C2C2C'
                }}
              >
                {Math.round(dayProgress)}%
              </div>
            </div>
            <div className="h-6 bg-white border-[3px] border-[#2C2C2C] relative overflow-hidden"
              style={{ boxShadow: '4px 4px 0 0 #2C2C2C' }}
            >
              <motion.div
                className="h-full border-r-[3px] border-[#2C2C2C]"
                style={{ 
                  width: `${dayProgress}%`,
                  backgroundColor: timeOfDay.color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${dayProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{ 
                  background: [
                    `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
                    `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
                  ],
                  backgroundPosition: ['-100% 0', '200% 0']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </div>

          <motion.div 
            className="mt-6 p-4 bg-[#C1F0E8] border-[3px] border-[#2C2C2C] text-center"
            style={{ boxShadow: '4px 4px 0 0 #2C2C2C' }}
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="font-semibold" style={{ color: '#2C2C2C' }}>
              ⚡ Stay focused & beat time blindness! ⚡
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
