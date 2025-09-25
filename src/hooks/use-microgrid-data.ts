"use client";

import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast, orderByKey } from "firebase/database";
import { db, isConfigPlaceholder } from "@/lib/firebase";
import type { MicrogridData } from "@/lib/types";

// Generate mock data for demonstration purposes if Firebase isn't configured
const generateMockData = (count: number): MicrogridData[] => {
  const data: MicrogridData[] = [];
  const now = new Date().getTime();
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * 5 * 60 * 1000;
    data.push({
      timestamp: timestamp,
      output_current: 1.2 + Math.random() * 0.5,
      output_voltage: 12.4 + Math.random() * 0.2,
      input_current: 1.1 + Math.random() * 0.4,
      input_voltage: 13.0 + Math.random() * 0.5,
      battery_soc: 75 + Math.random() * 10,
      charging_source: Math.random() > 0.3 ? 'renewable' : 'grid',
      battery_charge: 1450 + Math.random() * 100,
      efficiency: 93 + Math.random() * 3,
    });
  }
  return data.sort((a,b) => a.timestamp - b.timestamp);
};

const MOCK_DATA = generateMockData(100);

export const useMicrogridData = () => {
  const [data, setData] = useState<MicrogridData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConfigPlaceholder) {
      // Use mock data if firebase config is not set
      setTimeout(() => {
        setData(MOCK_DATA);
        setLoading(false);
      }, 1000)
      return;
    }

    const microgridDataRef = ref(db, "microgrid_data");
    const dataQuery = query(microgridDataRef, orderByKey(), limitToLast(100));

    const unsubscribe = onValue(
      dataQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const parsedData: MicrogridData[] = Object.keys(rawData).map((key) => ({
            ...rawData[key],
            timestamp: parseInt(key, 10), // The key is the timestamp
          })).sort((a, b) => a.timestamp - b.timestamp);
          setData(parsedData);
          setError(null);
        } else {
          // If no data exists, use mock data as a fallback for a better UX
          console.warn("No data found in Firebase. Displaying mock data.");
          setData(MOCK_DATA);
        }
        setLoading(false);
      },
      (err: any) => {
        console.error("Firebase read failed:", err);
        setError("Failed to fetch data from Firebase. Displaying mock data as fallback.");
        setData(MOCK_DATA); // Fallback to mock data on error
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const latestData = data.length > 0 ? data[data.length - 1] : undefined;

  return { data, latestData, loading, error };
};
