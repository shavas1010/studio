import { Bolt } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-3 border-b pb-4 mb-6">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Bolt className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        Microgrid Monitor
      </h1>
    </div>
  );
}
