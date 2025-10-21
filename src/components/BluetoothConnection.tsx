import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, BluetoothConnected, BluetoothOff, Loader2 } from "lucide-react";
import { useBluetoothSensor } from "@/hooks/useBluetoothSensor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

export function BluetoothConnection() {
  const {
    isSupported,
    connectedDevice,
    isConnecting,
    scanAndConnect,
    disconnect,
  } = useBluetoothSensor();
  const { t } = useLanguage();

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <BluetoothOff className="h-4 w-4" />
        <AlertDescription>
          {t("bluetooth.unsupported")}
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
          <h3 className="text-lg font-semibold">{t("bluetooth.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {connectedDevice ? t("bluetooth.status.connected") : t("bluetooth.status.disconnected")}
          </p>
        </div>
        {connectedDevice && (
          <Badge variant="default" className="bg-success">
            {t("bluetooth.status.connected")}
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
            {t("bluetooth.disconnect")}
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              {t("bluetooth.status.connected")}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={scanAndConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("bluetooth.status.searching")}
              </>
            ) : (
              <>
                <Bluetooth className="h-4 w-4 mr-2" />
                {t("bluetooth.scan")}
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
