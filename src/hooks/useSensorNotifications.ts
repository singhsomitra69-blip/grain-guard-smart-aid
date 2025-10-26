import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface SensorData {
  temperature: number;
  humidity: number;
  gas: number;
  vibration: number;
}

interface NotificationThresholds {
  temperature: { high: number };
  humidity: { high: number };
  gas: { elevated: number };
  vibration: { max: number };
  spoilageRisk: { critical: number };
}

const DEFAULT_THRESHOLDS: NotificationThresholds = {
  temperature: { high: 35 },
  humidity: { high: 70 },
  gas: { elevated: 0.5 },
  vibration: { max: 2 },
  spoilageRisk: { critical: 85 },
};

const calculateSpoilageRisk = (data: SensorData): number => {
  let risk = 0;
  
  // Temperature contribution (0-30%)
  if (data.temperature > 35) risk += 30;
  else if (data.temperature > 30) risk += 20;
  else if (data.temperature > 25) risk += 10;
  
  // Humidity contribution (0-30%)
  if (data.humidity > 70) risk += 30;
  else if (data.humidity > 65) risk += 20;
  else if (data.humidity > 60) risk += 10;
  
  // Gas contribution (0-25%)
  if (data.gas > 0.5) risk += 25;
  else if (data.gas > 0.3) risk += 15;
  else if (data.gas > 0.2) risk += 5;
  
  // Vibration contribution (0-15%)
  if (data.vibration > 2) risk += 15;
  else if (data.vibration > 1) risk += 10;
  
  return Math.min(risk, 100);
};

export function useSensorNotifications(sensorData: SensorData) {
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkAndNotify = () => {
      const notifications: Array<{ key: string; title: string; description: string }> = [];
      
      // Check temperature
      if (sensorData.temperature > DEFAULT_THRESHOLDS.temperature.high) {
        const key = `temp-${Math.floor(sensorData.temperature)}`;
        if (!notifiedRef.current.has(key)) {
          notifications.push({
            key,
            title: "⚠️ High Temperature Alert",
            description: `Temperature is ${sensorData.temperature.toFixed(1)}°C - exceeds safe threshold of ${DEFAULT_THRESHOLDS.temperature.high}°C`,
          });
        }
      }
      
      // Check humidity
      if (sensorData.humidity > DEFAULT_THRESHOLDS.humidity.high) {
        const key = `humidity-${Math.floor(sensorData.humidity)}`;
        if (!notifiedRef.current.has(key)) {
          notifications.push({
            key,
            title: "⚠️ High Moisture Alert",
            description: `Humidity is ${sensorData.humidity.toFixed(1)}% - exceeds safe threshold of ${DEFAULT_THRESHOLDS.humidity.high}%`,
          });
        }
      }
      
      // Check gas levels
      if (sensorData.gas > DEFAULT_THRESHOLDS.gas.elevated) {
        const key = `gas-${sensorData.gas.toFixed(2)}`;
        if (!notifiedRef.current.has(key)) {
          notifications.push({
            key,
            title: "⚠️ Elevated Gas Levels",
            description: `Gas level is ${sensorData.gas.toFixed(2)} ppm - exceeds safe threshold of ${DEFAULT_THRESHOLDS.gas.elevated} ppm`,
          });
        }
      }
      
      // Check vibration
      if (sensorData.vibration > DEFAULT_THRESHOLDS.vibration.max) {
        const key = `vibration-${sensorData.vibration.toFixed(1)}`;
        if (!notifiedRef.current.has(key)) {
          notifications.push({
            key,
            title: "⚠️ Abnormal Vibration Detected",
            description: `Vibration is ${sensorData.vibration.toFixed(1)} units - exceeds safe range of ${DEFAULT_THRESHOLDS.vibration.max} units`,
          });
        }
      }
      
      // Check spoilage risk
      const spoilageRisk = calculateSpoilageRisk(sensorData);
      if (spoilageRisk > DEFAULT_THRESHOLDS.spoilageRisk.critical) {
        const key = `spoilage-${Math.floor(spoilageRisk)}`;
        if (!notifiedRef.current.has(key)) {
          notifications.push({
            key,
            title: "🚨 Critical Spoilage Risk",
            description: `Spoilage risk is ${spoilageRisk.toFixed(0)}% - immediate action required!`,
          });
        }
      }
      
      // Send notifications
      notifications.forEach(({ key, title, description }) => {
        notifiedRef.current.add(key);
        
        toast({
          title,
          description,
          variant: "destructive",
        });
        
        // Browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, {
            body: description,
            icon: "/icon-192.png.jpeg",
          });
        }
      });
      
      // Clean up old notifications after 30 seconds
      setTimeout(() => {
        notifications.forEach(({ key }) => {
          notifiedRef.current.delete(key);
        });
      }, 30000);
    };

    checkAndNotify();
  }, [sensorData]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
}
