"use client";

import { format } from "date-fns";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { MicrogridData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface DataChartProps {
  data: MicrogridData[];
  title: string;
  description: string;
  lines: { dataKey: keyof MicrogridData; stroke: string; name: string, icon?: React.ComponentType }[];
  loading?: boolean;
}

export function DataChart({ data, title, description, lines, loading }: DataChartProps) {
  const chartConfig = lines.reduce((acc, line) => {
    acc[line.dataKey] = {
      label: line.name,
      color: line.stroke,
      icon: line.icon
    };
    return acc;
  }, {} as any);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] -ml-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer>
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => format(new Date(value), "HH:mm")}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                      indicator="line"
                      labelFormatter={(label) => format(new Date(label), "PP, hh:mm a")}
                    />}
                  />
                  <Legend />
                  {lines.map((line) => (
                    <Line
                      key={line.dataKey}
                      dataKey={line.dataKey}
                      type="monotone"
                      stroke={`var(--color-${line.dataKey})`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
