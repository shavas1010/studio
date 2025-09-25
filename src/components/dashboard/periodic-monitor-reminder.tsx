
"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

const REMINDER_INTERVAL = 60 * 1000; // 1 minute

export function PeriodicMonitorReminder() {
  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(() => {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <span>System Monitoring Active</span>
          </div>
        ),
        description: `Your microgrid dashboard is live and monitoring. Last check: ${new Date().toLocaleTimeString()}`,
        duration: 5000, 
      });
    }, REMINDER_INTERVAL);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  return null; // This component does not render anything itself
}
