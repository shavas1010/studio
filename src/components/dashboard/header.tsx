
import { Bolt, Wifi, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { isConfigPlaceholder } from '@/lib/firebase';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  lastUpdated: string;
  loading: boolean;
}

export function DashboardHeader({ lastUpdated, loading }: DashboardHeaderProps) {
  const isMockData = isConfigPlaceholder;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden"/>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Bolt className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Microgrid Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time data visualization and analysis
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 self-end sm:self-center">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Last update: {lastUpdated}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
           {isMockData ? (
              <>
                <WifiOff className="h-3 w-3 text-destructive" />
                <span>Using Mock Data</span>
              </>
            ) : (
              <>
                <Wifi className="h-3 w-3 text-success" />
                <span>Live Firebase Data</span>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
