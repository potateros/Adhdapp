import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Plus, Trash2, CheckCircle2, Flame, Zap, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

const PRIORITY_COLORS = {
  high: { bg: '#FFC4C4', text: '#2C2C2C', icon: Flame },
  medium: { bg: '#FFD4B2', text: '#2C2C2C', icon: Zap },
  low: { bg: '#C1F0E8', text: '#2C2C2C', icon: Circle },
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('adhd-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');

  useEffect(() => {
    localStorage.setItem('adhd-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        priority: newTaskPriority,
        createdAt: Date.now(),
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewTaskPriority('medium');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
    >
      <Card 
        className="border-[5px] border-[#2C2C2C] bg-white"
        style={{ 
          boxShadow: '8px 8px 0 0 #B3D9FF, 8px 8px 0 5px #2C2C2C'
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl" style={{ color: '#2C2C2C' }}>
            <CheckCircle2 className="w-7 h-7" strokeWidth={3} />
            Quick Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="border-[3px] border-[#2C2C2C] px-4 py-6 bg-white"
              style={{ boxShadow: '4px 4px 0 0 #2C2C2C' }}
            />
            <div className="flex gap-2">
              <div className="flex gap-2 flex-1">
                {(['high', 'medium', 'low'] as Priority[]).map((priority) => {
                  const Icon = PRIORITY_COLORS[priority].icon;
                  return (
                    <Button
                      key={priority}
                      onClick={() => setNewTaskPriority(priority)}
                      className="flex-1 border-[3px] border-[#2C2C2C] transition-all duration-150"
                      style={{
                        backgroundColor: newTaskPriority === priority ? PRIORITY_COLORS[priority].bg : '#FFFFFF',
                        color: '#2C2C2C',
                        boxShadow: newTaskPriority === priority ? '0 0 0 0 #2C2C2C' : '3px 3px 0 0 #2C2C2C',
                        transform: newTaskPriority === priority ? 'translate(3px, 3px)' : 'translate(0, 0)',
                      }}
                    >
                      <Icon className="w-4 h-4 mr-1" strokeWidth={3} />
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  );
                })}
              </div>
              <Button 
                onClick={addTask} 
                className="border-[3px] border-[#2C2C2C] px-6"
                style={{
                  backgroundColor: '#B3FFD9',
                  color: '#2C2C2C',
                  boxShadow: '4px 4px 0 0 #2C2C2C',
                }}
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {activeTasks.length === 0 && completedTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 border-[3px] border-dashed border-[#2C2C2C]"
              >
                <p className="text-lg font-semibold text-muted-foreground">
                  No tasks yet. Add one above! 🎯
                </p>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {activeTasks.map((task, index) => {
                const Icon = PRIORITY_COLORS[task.priority].icon;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -50, rotate: -2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: 50, rotate: 2 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                      delay: index * 0.05
                    }}
                    layout
                    className="flex items-start gap-3 p-4 border-[4px] border-[#2C2C2C] bg-white hover:translate-x-1 hover:translate-y-1 transition-transform"
                    style={{ 
                      boxShadow: `5px 5px 0 0 ${PRIORITY_COLORS[task.priority].bg}`
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 border-[2px] border-[#2C2C2C] w-6 h-6"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="break-words font-semibold" style={{ color: '#2C2C2C' }}>{task.text}</p>
                      <div 
                        className="inline-block mt-2 px-3 py-1 border-[2px] border-[#2C2C2C] font-semibold text-sm"
                        style={{ 
                          backgroundColor: PRIORITY_COLORS[task.priority].bg,
                          color: PRIORITY_COLORS[task.priority].text,
                        }}
                      >
                        <Icon className="w-3 h-3 inline mr-1" strokeWidth={3} />
                        {task.priority.toUpperCase()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="shrink-0 border-[2px] border-[#2C2C2C] hover:bg-[#FFC4C4]"
                      style={{ color: '#2C2C2C' }}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={3} />
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {completedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="pt-6 border-t-[3px] border-[#2C2C2C] border-dashed">
                  <div className="inline-block px-4 py-2 bg-[#B3FFD9] border-[3px] border-[#2C2C2C] mb-3"
                    style={{ boxShadow: '3px 3px 0 0 #2C2C2C' }}
                  >
                    <p className="font-semibold" style={{ color: '#2C2C2C' }}>
                      ✅ COMPLETED ({completedTasks.length})
                    </p>
                  </div>
                </div>
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="flex items-start gap-3 p-4 border-[3px] border-[#2C2C2C] bg-[#F5F5F5] opacity-70 mb-2"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1 border-[2px] border-[#2C2C2C] w-6 h-6"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="break-words line-through font-semibold" style={{ color: '#2C2C2C' }}>{task.text}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="shrink-0 border-[2px] border-[#2C2C2C]"
                        style={{ color: '#2C2C2C' }}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={3} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
