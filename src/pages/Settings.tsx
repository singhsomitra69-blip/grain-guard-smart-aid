import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Wifi, Languages } from "lucide-react";
import { BluetoothConnection } from "@/components/BluetoothConnection";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Languages className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t("settings.language")}</h2>
        </div>

        <div className="space-y-2 mb-6">
          <Label htmlFor="language">{t("settings.language.select")}</Label>
          <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t("settings.thresholds")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="temp-max">{t("settings.temp.max")}</Label>
            <Input
              id="temp-max"
              type="number"
              placeholder="35"
              defaultValue="35"
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.temp.alert")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temp-min">{t("settings.temp.min")}</Label>
            <Input
              id="temp-min"
              type="number"
              placeholder="20"
              defaultValue="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity-max">{t("settings.humidity.max")}</Label>
            <Input
              id="humidity-max"
              type="number"
              placeholder="70"
              defaultValue="70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity-min">{t("settings.humidity.min")}</Label>
            <Input
              id="humidity-min"
              type="number"
              placeholder="40"
              defaultValue="40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gas-max">{t("settings.gas.max")}</Label>
            <Input
              id="gas-max"
              type="number"
              step="0.1"
              placeholder="0.5"
              defaultValue="0.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vibration-max">{t("settings.vibration.max")}</Label>
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
          <h2 className="text-xl font-semibold">{t("settings.notifications")}</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.notifications.push")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.notifications.push.desc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.notifications.voice")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.notifications.voice.desc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.notifications.sms")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.notifications.sms.desc")}
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.notifications.ai")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.notifications.ai.desc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-2 mb-6">
          <Wifi className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t("settings.connection")}</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label>{t("settings.connection.type")}</Label>
            <div className="flex gap-2">
              <Button variant="default">Wi-Fi</Button>
              <Button variant="outline">GSM</Button>
              <Button variant="outline">LoRa</Button>
            </div>
          </div>
        </div>

        <BluetoothConnection />

        <div className="flex gap-3 mt-6">
          <Button className="w-full md:w-auto">{t("settings.save")}</Button>
          <Button variant="outline" className="w-full md:w-auto">
            {t("settings.reset")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
