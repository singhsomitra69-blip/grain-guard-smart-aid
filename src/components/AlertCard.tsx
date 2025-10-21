import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export type AlertType = "info" | "warning" | "danger" | "prediction";

interface AlertCardProps {
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
}

const alertTypeKeys = {
  info: "alerts.type.info",
  warning: "alerts.type.warning",
  danger: "alerts.type.danger",
  prediction: "alerts.type.prediction",
};


const alertConfig = {
  info: {
    icon: Info,
    badgeVariant: "secondary" as const,
    iconColor: "text-accent",
    className: "border-accent/20 bg-accent/5",
  },
  warning: {
    icon: AlertTriangle,
    badgeVariant: "secondary" as const,
    iconColor: "text-warning",
    className: "border-warning/20 bg-warning/5",
  },
  danger: {
    icon: AlertCircle,
    badgeVariant: "destructive" as const,
    iconColor: "text-destructive",
    className: "border-destructive/20 bg-destructive/5",
  },
  prediction: {
    icon: AlertTriangle,
    badgeVariant: "default" as const,
    iconColor: "text-primary",
    className: "border-primary/20 bg-primary/5",
  },
};

export function AlertCard({ type, title, message, timestamp }: AlertCardProps) {
  const config = alertConfig[type];
  const Icon = config.icon;
  const { t } = useLanguage();

  return (
    <Card className={cn("p-4 border-l-4", config.className)}>
      <div className="flex gap-4">
        <div className={cn("flex-shrink-0 mt-1", config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <Badge variant={config.badgeVariant} className="text-xs">
              {t(alertTypeKeys[type])}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </div>
    </Card>
  );
}
