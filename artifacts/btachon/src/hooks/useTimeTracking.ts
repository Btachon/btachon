import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTimeTracking() {
  const [trackedMinutesData, setTrackedMinutes] = useLocalStorage<Record<string, number>>('timeTracking', {});
  const [trigger, setTrigger] = useState(0);
  
  const activeMinutesRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const deltaMs = now - lastTickRef.current;
        const deltaMinutes = deltaMs / 60000;
        
        activeMinutesRef.current += deltaMinutes;
        
        if (activeMinutesRef.current >= 1) {
          const wholeMinutes = Math.floor(activeMinutesRef.current);
          activeMinutesRef.current -= wholeMinutes;
          
          const today = new Date().toISOString().split('T')[0];
          
          setTrackedMinutes(prev => ({
            ...prev,
            [today]: (prev[today] || 0) + wholeMinutes
          }));
          setTrigger(t => t + 1); // Force re-render
        }
      }
      lastTickRef.current = Date.now();
    };

    // Run every 10 seconds to check for minute accumulation
    const interval = setInterval(tick, 10000);
    
    const handleVisibilityChange = () => {
      lastTickRef.current = Date.now();
      if (document.visibilityState === 'visible') {
        tick();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setTrackedMinutes]);

  const getTodayMinutes = () => {
    const today = new Date().toISOString().split('T')[0];
    return trackedMinutesData[today] || 0;
  };

  const getThisWeekMinutes = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    
    let total = 0;
    for (let i = 0; i <= 6; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      if (trackedMinutesData[dateStr]) {
        total += trackedMinutesData[dateStr];
      }
    }
    return total;
  };

  const getTotalMinutes = () => {
    return Object.values(trackedMinutesData).reduce((a, b) => a + b, 0);
  };

  const getTotalHoursReclaimed = () => {
    return 14.5 + (getTotalMinutes() / 60);
  };

  const getTier = (hours: number, streak: number) => {
    const score = hours + (streak * 2);
    if (score > 100) return 'Elite';
    if (score > 50) return 'Steadfast';
    if (score > 25) return 'Striving';
    if (score > 15) return 'Awakening';
    return 'Zombified';
  };

  const currentTier = getTier(getTotalHoursReclaimed(), 12); // TODO: wire real streak

  return {
    todayMinutes: getTodayMinutes(),
    thisWeekMinutes: getThisWeekMinutes(),
    totalMinutes: getTotalMinutes(),
    totalHoursReclaimed: getTotalHoursReclaimed(),
    currentTier,
    _trigger: trigger
  };
}