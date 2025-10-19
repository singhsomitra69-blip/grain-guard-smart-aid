import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Wifi } from "lucide-react";
import { BluetoothConnection } from "@/components/BluetoothConnection";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure thresholds and notifications
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Safety Thresholds</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="temp-max">Maximum Temperature (°C)</Label>
            <Input
              id="temp-max"
              type="number"
              placeholder="35"
              defaultValue="35"
            />
            <p className="text-xs text-muted-foreground">
              Alert when temperature exceeds this value
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temp-min">Minimum Temperature (°C)</Label>
            <Input
              id="temp-min"
              type="number"
              placeholder="20"
              defaultValue="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity-max">Maximum Humidity (%)</Label>
            <Input
              id="humidity-max"
              type="number"
              placeholder="70"
              defaultValue="70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity-min">Minimum Humidity (%)</Label>
            <Input
              id="humidity-min"
              type="number"
              placeholder="40"
              defaultValue="40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gas-max">Maximum Gas Level (ppm)</Label>
            <Input
              id="gas-max"
              type="number"
              step="0.1"
              placeholder="0.5"
              defaultValue="0.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vibration-max">Maximum Vibration</Label>
            <Input
              id="vibration-max"
              type="number"
              placeholder="2"
              defaultValue="2"
            />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts on your device
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Voice Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Enable audio notifications for critical alerts
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send text messages for urgent alerts
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Prediction Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify when AI detects spoilage risk
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-2 mb-6">
          <Wifi className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Connection</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label>Connection Type</Label>
            <div className="flex gap-2">
              <Button variant="default">Wi-Fi</Button>
              <Button variant="outline">GSM</Button>
              <Button variant="outline">LoRa</Button>
            </div>
          </div>
        </div>

        <BluetoothConnection />

        <div className="flex gap-3 mt-6">
          <Button className="w-full md:w-auto">Save Settings</Button>
          <Button variant="outline" className="w-full md:w-auto">
            Reset to Default
          </Button>
        </div>
      </Card>
    </div>
  );
}
