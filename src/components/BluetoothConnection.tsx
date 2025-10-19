import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, BluetoothConnected, BluetoothOff, Loader2 } from "lucide-react";
import { useBluetoothSensor } from "@/hooks/useBluetoothSensor";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BluetoothConnection() {
  const {
    isSupported,
    connectedDevice,
    isConnecting,
    scanAndConnect,
    disconnect,
  } = useBluetoothSensor();

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <BluetoothOff className="h-4 w-4" />
        <AlertDescription>
          Web Bluetooth is not supported in your browser. Try using Chrome, Edge, or Opera on desktop or Android.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        {connectedDevice ? (
          <BluetoothConnected className="h-6 w-6 text-primary" />
        ) : (
          <Bluetooth className="h-6 w-6 text-muted-foreground" />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Bluetooth Sensors</h3>
          <p className="text-sm text-muted-foreground">
            Connect to external BLE sensors
          </p>
        </div>
        {connectedDevice && (
          <Badge variant="default" className="bg-success">
            Connected
          </Badge>
        )}
      </div>

      {connectedDevice ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
            <div>
              <p className="font-medium">{connectedDevice.name}</p>
              <p className="text-sm text-muted-foreground">Device ID: {connectedDevice.id}</p>
            </div>
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
          </div>

          <Button
            variant="destructive"
            onClick={disconnect}
            className="w-full"
          >
            <Bluetooth className="h-4 w-4 mr-2" />
            Disconnect Sensor
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              Sensor data is being streamed in real-time to the dashboard.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              Make sure your Bluetooth sensor is powered on and in pairing mode before scanning.
            </AlertDescription>
          </Alert>

          <Button
            onClick={scanAndConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Bluetooth className="h-4 w-4 mr-2" />
                Scan for Sensors
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Supported Sensors:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Environmental Sensing BLE devices</li>
              <li>Temperature & Humidity sensors</li>
              <li>Custom grain storage sensors</li>
              <li>Compatible with standard BLE protocols</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
