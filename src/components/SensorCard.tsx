import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export type SensorStatus = "safe" | "warning" | "danger";

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: LucideIcon;
  status: SensorStatus;
  description?: string;
}

const statusConfigKeys = {
  safe: "sensor.status.safe",
  warning: "sensor.status.warning",
  danger: "sensor.status.danger",
};


const statusConfig = {
  safe: {
    badgeVariant: "default" as const,
    className: "border-success/20 bg-success/5",
  },
  warning: {
    badgeVariant: "secondary" as const,
    className: "border-warning/20 bg-warning/5",
  },
  danger: {
    badgeVariant: "destructive" as const,
    className: "border-destructive/20 bg-destructive/5",
  },
};

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  status,
  description,
}: SensorCardProps) {
  const config = statusConfig[status];
  const { t } = useLanguage();

  return (
    <Card
      className={cn(
        "p-6 border-2 transition-all duration-300 hover:shadow-lg",
        config.className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/50">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              {title}
            </h3>
          </div>
        </div>
        <Badge variant={config.badgeVariant}>{t(statusConfigKeys[status])}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground">{value}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}
