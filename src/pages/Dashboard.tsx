import { useEffect, useState } from "react";
import { SensorCard, SensorStatus } from "@/components/SensorCard";
import { Thermometer, Droplets, Wind, Activity } from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  gas: number;
  vibration: number;
  timestamp: string;
}

const getTemperatureStatus = (temp: number): SensorStatus => {
  if (temp > 35) return "danger";
  if (temp > 30) return "warning";
  return "safe";
};

const getHumidityStatus = (humidity: number): SensorStatus => {
  if (humidity > 70 || humidity < 40) return "danger";
  if (humidity > 65 || humidity < 45) return "warning";
  return "safe";
};

const getGasStatus = (gas: number): SensorStatus => {
  if (gas > 0.5) return "danger";
  if (gas > 0.3) return "warning";
  return "safe";
};

const getVibrationStatus = (vibration: number): SensorStatus => {
  if (vibration > 2) return "danger";
  if (vibration > 1) return "warning";
  return "safe";
};

// Simulated sensor data - in production, this would come from Firebase
const simulateSensorData = (): SensorData => ({
  temperature: 25 + Math.random() * 15,
  humidity: 45 + Math.random() * 30,
  gas: Math.random() * 0.6,
  vibration: Math.random() * 3,
  timestamp: new Date().toISOString(),
});

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>(simulateSensorData());

  useEffect(() => {
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setSensorData(simulateSensorData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time grain storage monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Temperature"
          value={sensorData.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          status={getTemperatureStatus(sensorData.temperature)}
          description="Optimal: 20-30°C"
        />

        <SensorCard
          title="Humidity"
          value={sensorData.humidity.toFixed(1)}
          unit="%"
          icon={Droplets}
          status={getHumidityStatus(sensorData.humidity)}
          description="Optimal: 45-65%"
        />

        <SensorCard
          title="Gas Level"
          value={sensorData.gas.toFixed(2)}
          unit="ppm"
          icon={Wind}
          status={getGasStatus(sensorData.gas)}
          description="Optimal: <0.3 ppm"
        />

        <SensorCard
          title="Vibration"
          value={sensorData.vibration.toFixed(1)}
          unit="units"
          icon={Activity}
          status={getVibrationStatus(sensorData.vibration)}
          description="Optimal: <1.0 units"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">System Status</h2>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(sensorData.timestamp).toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Auto-refresh every 5 seconds • Connected to IoT sensors
        </p>
      </div>
    </div>
  );
}
