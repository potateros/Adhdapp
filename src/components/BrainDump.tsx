import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Lightbulb, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

const NOTE_COLORS = ['#FFE1E9', '#D4E8FF', '#FFF4B3', '#C1F0E8', '#E6D5F5', '#FFD4B2'];

export function BrainDump() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('adhd-brain-dump');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    localStorage.setItem('adhd-brain-dump', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (currentNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: currentNote.trim(),
        timestamp: Date.now(),
      };
      setNotes([note, ...notes]);
      setCurrentNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
    >
      <Card 
        className="border-[5px] border-[#2C2C2C] bg-white"
        style={{ 
          boxShadow: '8px 8px 0 0 #FFB3D9, 8px 8px 0 5px #2C2C2C'
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl" style={{ color: '#2C2C2C' }}>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Lightbulb className="w-7 h-7 fill-[#FFF4B3] text-[#FFF4B3]" strokeWidth={3} />
            </motion.div>
            Brain Dump
          </CardTitle>
          <p className="font-semibold text-sm mt-2 px-3 py-1 bg-[#FFF4B3] border-[2px] border-[#2C2C2C] inline-block"
            style={{ boxShadow: '2px 2px 0 0 #2C2C2C', color: '#2C2C2C' }}
          >
            💭 Capture random thoughts quickly!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Textarea
              placeholder="What's on your mind? Just dump it here..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              rows={4}
              className="resize-none border-[3px] border-[#2C2C2C] px-4 py-3 bg-white"
              style={{ boxShadow: '4px 4px 0 0 #2C2C2C', color: '#2C2C2C' }}
            />
            <Button 
              onClick={saveNote} 
              className="w-full border-[3px] border-[#2C2C2C] py-6"
              style={{
                backgroundColor: '#B3FFD9',
                color: '#2C2C2C',
                boxShadow: '5px 5px 0 0 #2C2C2C',
              }}
            >
              <Save className="w-5 h-5 mr-2" strokeWidth={3} />
              SAVE THOUGHT
            </Button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 border-[3px] border-dashed border-[#2C2C2C]"
              >
                <p className="text-lg font-semibold text-muted-foreground">
                  No thoughts captured yet 🧠
                </p>
              </motion.div>
            )}
            <AnimatePresence mode="popLayout">
              {notes.map((note, index) => {
                const bgColor = NOTE_COLORS[index % NOTE_COLORS.length];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 5, scale: 0.8 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: index * 0.05
                    }}
                    layout
                    whileHover={{ 
                      rotate: [0, -2, 2, -2, 0],
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className="p-4 border-[4px] border-[#2C2C2C] hover:translate-x-1 hover:translate-y-1 transition-transform"
                    style={{ 
                      backgroundColor: bgColor,
                      boxShadow: '6px 6px 0 0 #2C2C2C',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="flex-1 break-words whitespace-pre-wrap font-semibold" style={{ color: '#2C2C2C' }}>
                        {note.text}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="shrink-0 border-[2px] border-[#2C2C2C] bg-white hover:bg-[#FFC4C4]"
                        style={{ color: '#2C2C2C' }}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={3} />
                      </Button>
                    </div>
                    <div 
                      className="inline-block px-3 py-1 bg-[#2C2C2C] text-white border-[2px] border-[#2C2C2C] text-xs font-semibold"
                    >
                      ⏰ {formatTimestamp(note.timestamp)}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
