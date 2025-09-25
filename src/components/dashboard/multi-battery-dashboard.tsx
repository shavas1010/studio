
"use client";

import { useMultiBatteryData } from "@/hooks/use-multi-battery-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Battery, BatteryFull, BatteryWarning, ChevronsRight, Power, Sun, TriangleAlert, Zap, ZapOff } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const getStatusBadge = (status: string) => {
  if (status.includes("LOW")) return <Badge variant="destructive">LOW</Badge>;
  if (status.includes("FULL")) return <Badge variant="secondary">FULL</Badge>;
  if (status.includes("FAULT")) return <Badge variant="destructive">FAULT</Badge>;
  if (status.includes("Recovered")) return <Badge className="bg-green-500 text-white">RECOVERED</Badge>;
  return null;
}

const getSoCIcon = (soc: number) => {
  if (soc < 45) return <BatteryWarning className="text-destructive" />;
  if (soc > 95) return <BatteryFull className="text-success" />;
  return <Battery className="text-primary" />;
}

export function MultiBatteryDashboard() {
  const { latestData, loading, error } = useMultiBatteryData();

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
    </div>;
  }

  if (error) {
    return <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
    </Alert>
  }

  if (!latestData) {
    return <Alert>
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No simulation data available yet.</AlertDescription>
    </Alert>
  }
  
  const { battery1, battery2, battery3, onMainPower, isDumpingSolar, faultDetected, activeBattery } = latestData;

  const isActive = (batteryNum: number) => activeBattery === batteryNum;

  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Arduino Simulation Status</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className={isActive(1) ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Battery 1 (Underflow)</span>
                        <div className="flex items-center gap-2">
                          {isActive(1) && <Badge>Active</Badge>}
                          {getSoCIcon(battery1.soc)}
                        </div>
                    </CardTitle>
                    <CardDescription>{battery1.status}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{battery1.soc}%</div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {onMainPower ? <><Power className="text-warning"/><span>On Mains</span></> : <><Zap className="text-success"/><span>On Storage</span></>}
                    </div>
                </CardContent>
            </Card>
             <Card className={isActive(2) ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Battery 2 (Overflow)</span>
                        <div className="flex items-center gap-2">
                          {isActive(2) && <Badge>Active</Badge>}
                          {getSoCIcon(battery2.soc)}
                        </div>
                    </CardTitle>
                    <CardDescription>{battery2.status}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{battery2.soc}%</div>
                     <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {isDumpingSolar ? <><Sun className="text-destructive"/><span>Dumping Solar</span></> : <><ChevronsRight className="text-success"/><span>Charging</span></>}
                    </div>
                </CardContent>
            </Card>
             <Card className={isActive(3) ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Battery 3 (Fault)</span>
                         <div className="flex items-center gap-2">
                          {isActive(3) && <Badge>Active</Badge>}
                          {getSoCIcon(battery3.soc)}
                        </div>
                    </CardTitle>
                    <CardDescription>{battery3.status}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{battery3.soc}%</div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {faultDetected ? <><ZapOff className="text-destructive"/><span>FAULT DETECTED</span></> : <><Zap className="text-success"/><span>OK</span></>}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
