import { useEffect, useState } from "react";
import { SensorCard, SensorStatus } from "@/components/SensorCard";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { ChatPanel } from "@/components/ChatPanel";
import { Thermometer, Droplets, Wind, Activity } from "lucide-react";
import { useBluetoothSensor } from "@/hooks/useBluetoothSensor";
import { useSensorNotifications } from "@/hooks/useSensorNotifications";
import { BluetoothConnection } from "@/components/BluetoothConnection";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

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

  // Monitor sensor data and send notifications
  useSensorNotifications(sensorData);

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
      <div className="mb-6 flex justify-end">
        <BluetoothConnection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VoiceAssistant sensorData={sensorData} />
        <ChatPanel sensorData={sensorData} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {connectedDevice && (
            <Badge variant="default" className="bg-primary">
              {t("dashboard.bluetooth.connected")}
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
          title={t("sensor.temperature")}
          value={sensorData.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          status={getTemperatureStatus(sensorData.temperature)}
          description={sensorData.temperature > 30 ? t("sensor.temp.high") : t("sensor.temp.optimal")}
        />

        <SensorCard
          title={t("sensor.humidity")}
          value={sensorData.humidity.toFixed(1)}
          unit="%"
          icon={Droplets}
          status={getHumidityStatus(sensorData.humidity)}
          description={(sensorData.humidity > 70 || sensorData.humidity < 40) ? t("sensor.humidity.high") : t("sensor.humidity.optimal")}
        />

        <SensorCard
          title={t("sensor.gas")}
          value={sensorData.gas.toFixed(2)}
          unit="ppm"
          icon={Wind}
          status={getGasStatus(sensorData.gas)}
          description={sensorData.gas > 0.3 ? t("sensor.gas.elevated") : t("sensor.gas.normal")}
        />

        <SensorCard
          title={t("sensor.vibration")}
          value={sensorData.vibration.toFixed(1)}
          unit="units"
          icon={Activity}
          status={getVibrationStatus(sensorData.vibration)}
          description={sensorData.vibration > 1 ? t("sensor.vibration.detected") : t("sensor.vibration.stable")}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">{t("dashboard.status.overview")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.last_updated")}: {new Date(sensorData.timestamp).toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {connectedDevice 
            ? `${t("bluetooth.status.connected")} ${connectedDevice.name}` 
            : t("dashboard.status.all_systems")
          }
        </p>
        {!connectedDevice && (
          <p className="text-xs text-warning mt-2">
            💡 {t("dashboard.status.check_alerts")}
          </p>
        )}
      </div>
    </div>
  );
}
