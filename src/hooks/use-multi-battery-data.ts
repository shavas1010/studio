
"use client";

import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast, orderByKey } from "firebase/database";
import { db, isConfigPlaceholder } from "@/lib/firebase";
import type { MultiBatteryData } from "@/lib/types";

const generateMockMultiBatteryData = (count: number): MultiBatteryData[] => {
  const data: MultiBatteryData[] = [];
  const now = new Date().getTime();
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * 1000;
    data.push({
      timestamp: timestamp,
      battery1: { soc: 36 + i % 25, status: "Underflow Scenario" },
      battery2: { soc: 98 - i % 15, status: "Overflow Scenario" },
      battery3: { soc: 80 - (i % 5) * 5, status: "Fault Scenario" },
      faultDetected: (i % 20) === 0,
      onMainPower: (i % 10) < 5,
      isDumpingSolar: (i % 12) < 6,
      activeBattery: (i % 3) + 1,
    });
  }
  return data;
};

const MOCK_DATA = generateMockMultiBatteryData(20);

export const useMultiBatteryData = () => {
  const [data, setData] = useState<MultiBatteryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConfigPlaceholder) {
      setTimeout(() => {
        setData(MOCK_DATA);
        setLoading(false);
      }, 1000);
      return;
    }

    const multiBatteryDataRef = ref(db, "microgrid_simulation");
    const dataQuery = query(multiBatteryDataRef, orderByKey(), limitToLast(20));

    const unsubscribe = onValue(
      dataQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const parsedData: MultiBatteryData[] = Object.keys(rawData).map((key) => ({
            ...rawData[key],
            timestamp: parseInt(key, 10),
          })).sort((a, b) => a.timestamp - b.timestamp);
          setData(parsedData);
          setError(null);
        } else {
          console.warn("No multi-battery data found in Firebase. Displaying mock data.");
          setData(MOCK_DATA);
        }
        setLoading(false);
      },
      (err: any) => {
        console.error("Firebase read failed for multi-battery data:", err);
        setError("Failed to fetch simulation data. Displaying mock data as fallback.");
        setData(MOCK_DATA);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const latestData = data.length > 0 ? data[data.length - 1] : undefined;

  return { data, latestData, loading, error };
};
