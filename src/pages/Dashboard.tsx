import { useEffect, useState } from "react";
import { SensorCard, SensorStatus } from "@/components/SensorCard";
import { Thermometer, Droplets, Wind, Activity } from "lucide-react";
import { useBluetoothSensor } from "@/hooks/useBluetoothSensor";
import { Badge } from "@/components/ui/badge";

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
  const [simulatedData, setSimulatedData] = useState<SensorData>(simulateSensorData());
  const { connectedDevice, sensorData: bluetoothData } = useBluetoothSensor();

  // Use Bluetooth data if available, otherwise use simulated data
  const sensorData = connectedDevice && bluetoothData 
    ? {
        temperature: bluetoothData.temperature ?? simulatedData.temperature,
        humidity: bluetoothData.humidity ?? simulatedData.humidity,
        gas: bluetoothData.gas ?? simulatedData.gas,
        vibration: bluetoothData.vibration ?? simulatedData.vibration,
        timestamp: bluetoothData.timestamp,
      }
    : simulatedData;

  useEffect(() => {
    // Only run simulated updates if not connected to Bluetooth
    if (!connectedDevice) {
      const interval = setInterval(() => {
        setSimulatedData(simulateSensorData());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [connectedDevice]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time grain storage monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          {connectedDevice && (
            <Badge variant="default" className="bg-primary">
              Bluetooth Connected
            </Badge>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span>Live</span>
          </div>
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
          {connectedDevice 
            ? `Connected to Bluetooth sensor: ${connectedDevice.name}` 
            : "Auto-refresh every 5 seconds • Simulated sensor data"
          }
        </p>
        {!connectedDevice && (
          <p className="text-xs text-warning mt-2">
            💡 Connect a Bluetooth sensor in Settings for real sensor data
          </p>
        )}
      </div>
    </div>
  );
}
