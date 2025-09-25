
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number | undefined;
  unit: string;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function MetricCard({ title, value, unit, icon, description, loading, onClick }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-6 w-6 rounded-sm" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-3 w-1/2 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onClick} 
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:bg-muted"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value !== undefined ? value : "-"}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        {description && <p className="text-xs text-muted-foreground pt-1 truncate">{description}</p>}
      </CardContent>
    </Card>
  );
}
