/// <reference path="../types/bluetooth.d.ts" />
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface SensorData {
  temperature?: number;
  humidity?: number;
  gas?: number;
  vibration?: number;
  timestamp: string;
}

interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
}

export function useBluetoothSensor() {
  const [isSupported, setIsSupported] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if Web Bluetooth API is supported
    setIsSupported('bluetooth' in navigator);
  }, []);

  const scanAndConnect = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Web Bluetooth API",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Request Bluetooth device
      // Common BLE service UUIDs for environmental sensors
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['environmental_sensing'] }, // Standard environmental sensing service
          { services: ['0000181a-0000-1000-8000-00805f9b34fb'] }, // Environmental Sensing UUID
        ],
        optionalServices: [
          'battery_service',
          '00001800-0000-1000-8000-00805f9b34fb', // Generic Access
          '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute
        ],
      });

      if (!device) {
        throw new Error("No device selected");
      }

      // Connect to GATT server
      const server = await device.gatt?.connect();
      
      if (!server) {
        throw new Error("Failed to connect to device");
      }

      // Store device info
      setConnectedDevice({
        id: device.id,
        name: device.name || "Unknown Sensor",
        connected: true,
      });

      toast({
        title: "Connected Successfully",
        description: `Connected to ${device.name || "sensor"}`,
      });

      // Listen for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setConnectedDevice(null);
        setSensorData(null);
        toast({
          title: "Device Disconnected",
          description: "Bluetooth sensor has been disconnected",
          variant: "destructive",
        });
      });

      // Start reading sensor data
      startReadingData(server);

    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to device",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isSupported]);

  const startReadingData = async (server: any) => {
    try {
      // Get Environmental Sensing service
      const service = await server.getPrimaryService('environmental_sensing');

      // Read temperature (UUID: 0x2A6E)
      try {
        const tempCharacteristic = await service.getCharacteristic('temperature');
        tempCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target.value;
          const temperature = value.getInt16(0, true) / 100; // Typical format
          updateSensorData({ temperature });
        });
        await tempCharacteristic.startNotifications();
      } catch (e) {
        console.log("Temperature characteristic not available");
      }

      // Read humidity (UUID: 0x2A6F)
      try {
        const humidityCharacteristic = await service.getCharacteristic('humidity');
        humidityCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target.value;
          const humidity = value.getUint16(0, true) / 100;
          updateSensorData({ humidity });
        });
        await humidityCharacteristic.startNotifications();
      } catch (e) {
        console.log("Humidity characteristic not available");
      }

      // For gas and vibration, you'd need custom UUIDs from your sensor manufacturer
      // This is a generic implementation
      
    } catch (error) {
      console.error("Error reading sensor data:", error);
      toast({
        title: "Data Reading Error",
        description: "Failed to read sensor data. Check sensor compatibility.",
        variant: "destructive",
      });
    }
  };

  const updateSensorData = (newData: Partial<SensorData>) => {
    setSensorData(prev => ({
      ...prev,
      ...newData,
      timestamp: new Date().toISOString(),
    }));
  };

  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      try {
        // The device will auto-disconnect when we clear the reference
        setConnectedDevice(null);
        setSensorData(null);
        toast({
          title: "Disconnected",
          description: "Bluetooth sensor disconnected successfully",
        });
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    }
  }, [connectedDevice]);

  return {
    isSupported,
    connectedDevice,
    sensorData,
    isConnecting,
    scanAndConnect,
    disconnect,
  };
}
