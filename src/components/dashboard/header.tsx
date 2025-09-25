
import { Bolt } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardHeaderProps {
  lastUpdated: string;
  loading: boolean;
}

export function DashboardHeader({ lastUpdated, loading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
      <div className="flex items-center gap-4">
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
      <div className="text-sm text-muted-foreground self-end sm:self-center">
        {loading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Last update: {lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}
