"use client";

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getEfficiencySuggestions } from '@/ai/flows/efficiency-analysis-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { MicrogridData } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EfficiencyAnalyzerProps {
  historicalData: MicrogridData[];
  loading: boolean;
}

export function EfficiencyAnalyzer({ historicalData, loading: dataLoading }: EfficiencyAnalyzerProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (historicalData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Not enough data',
        description: 'There is not enough historical data to perform an analysis.',
      });
      return;
    }

    setLoading(true);
    setSuggestions(null);

    try {
      const dataString = JSON.stringify(historicalData, null, 2);
      const result = await getEfficiencySuggestions({ historicalData: dataString });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get suggestions from the AI model. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Efficiency Analysis</CardTitle>
        <CardDescription>
          Get data-informed suggestions on how to improve your microgrid's efficiency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={handleAnalysis} disabled={loading || dataLoading} className="max-w-xs">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Analyze Efficiency
          </Button>

          {loading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing historical data... This may take a moment.</span>
            </div>
          )}

          {suggestions && (
             <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Efficiency Suggestions</AlertTitle>
              <AlertDescription>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: suggestions }}></div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
