
"use client";

import { useState } from "react";
import { useMicrogridData } from "@/hooks/use-microgrid-data";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DataChart } from "@/components/dashboard/data-chart";
import { EfficiencyAnalyzer } from "@/components/dashboard/efficiency-analyzer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDownUp, Battery, BatteryCharging, BatteryWarning, Gauge, Grid, Leaf, TriangleAlert, Waves, Zap } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data, latestData, loading, error } = useMicrogridData();
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);

  const batteryStatusIcon = () => {
    if (!latestData) return <BatteryWarning className="h-6 w-6 text-muted-foreground" />;
    if (latestData.battery_soc < 20) {
      return <BatteryWarning className="h-6 w-6 text-destructive" />;
    }
    return <BatteryCharging className="h-6 w-6 text-success" />;
  };

  const chargingSourceIcon = () => {
    if (!latestData) return <Grid className="h-6 w-6 text-muted-foreground" />;
    if (latestData.charging_source === 'renewable') {
      return <Leaf className="h-6 w-6 text-success" />;
    }
    return <Grid className="h-6 w-6 text-warning" />;
  };

  const efficiencyStatusIcon = () => {
    if (!latestData) return <Gauge className="h-6 w-6 text-muted-foreground" />;
    if (latestData.efficiency < 90) {
      return <Gauge className="h-6 w-6 text-warning" />;
    }
    if (latestData.efficiency > 95) {
      return <Gauge className="h-6 w-6 text-success" />;
    }
    return <Gauge className="h-6 w-6 text-primary" />;
  };

  const lastUpdated = latestData?.timestamp ? format(new Date(latestData.timestamp), "PP, hh:mm:ss a") : "N/A";
  
  const handleHighlight = (chart: string) => {
    setHighlightedChart(highlightedChart === chart ? null : chart);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <DashboardHeader loading={loading} lastUpdated={lastUpdated} />
        
        {error && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Battery SOC"
            value={latestData?.battery_soc !== undefined ? latestData.battery_soc.toFixed(1) : undefined}
            unit="%"
            icon={batteryStatusIcon()}
            description={latestData?.charging_source === 'renewable' ? 'Charging from renewables' : 'Charging from grid'}
            loading={loading}
            onClick={() => handleHighlight('battery_efficiency')}
          />
          <MetricCard
            title="Efficiency"
            value={latestData?.efficiency !== undefined ? latestData.efficiency.toFixed(1) : undefined}
            unit="%"
            icon={efficiencyStatusIcon()}
            description="Overall system efficiency"
            loading={loading}
            onClick={() => handleHighlight('battery_efficiency')}
          />
          <MetricCard
            title="Power Flow"
            value={latestData ? ((latestData.output_voltage || 0) * (latestData.output_current || 0)).toFixed(1) : undefined}
            unit="W"
            icon={<ArrowDownUp className="h-6 w-6 text-primary" />}
            description="Current output power"
            loading={loading}
            onClick={() => handleHighlight('power')}
          />
          <MetricCard
            title="Charging Source"
            value={latestData?.charging_source ? latestData.charging_source.charAt(0).toUpperCase() + latestData.charging_source.slice(1) : undefined}
            unit=""
            icon={chargingSourceIcon()}
            description="Renewable vs. Grid power source"
            loading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
           <DataChart
              title="Voltage Levels"
              description="Input and output voltage over the last few hours."
              data={data}
              lines={[
                { dataKey: "input_voltage", stroke: "hsl(var(--chart-1))", name: "Input Voltage", icon: Zap },
                { dataKey: "output_voltage", stroke: "hsl(var(--chart-2))", name: "Output Voltage", icon: Zap },
              ]}
              loading={loading}
              isHighlighted={highlightedChart === 'power'}
            />
           <DataChart
              title="Current Flow"
              description="Input and output current over the last few hours."
              data={data}
              lines={[
                { dataKey: "input_current", stroke: "hsl(var(--chart-1))", name: "Input Current", icon: Waves },
                { dataKey: "output_current", stroke: "hsl(var(--chart-2))", name: "Output Current", icon: Waves },
              ]}
              loading={loading}
              isHighlighted={highlightedChart === 'power'}
            />
        </div>
        
         <div className="grid gap-4">
             <DataChart
                title="Battery & Efficiency"
                description="Battery State of Charge and system efficiency over time."
                data={data}
                lines={[
                  { dataKey: "battery_soc", stroke: "hsl(var(--chart-1))", name: "Battery SOC (%)", icon: Battery },
                  { dataKey: "efficiency", stroke: "hsl(var(--chart-2))", name: "Efficiency (%)", icon: Gauge },
                ]}
                loading={loading}
                isHighlighted={highlightedChart === 'battery_efficiency'}
              />
        </div>

        <EfficiencyAnalyzer historicalData={data} loading={loading} />

      </div>
    </main>
  );
}
