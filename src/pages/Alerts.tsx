import { AlertCard, AlertType } from "@/components/AlertCard";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
}

// Simulated alerts data
const alerts: Alert[] = [
  {
    id: "1",
    type: "danger",
    title: "High Temperature Detected",
    message:
      "Temperature has exceeded 35°C in Storage Unit A. Immediate cooling recommended.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleString(),
  },
  {
    id: "2",
    type: "warning",
    title: "Humidity Rising",
    message:
      "Humidity levels approaching 68%. Monitor closely to prevent moisture damage.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString(),
  },
  {
    id: "3",
    type: "prediction",
    title: "AI Spoilage Risk Alert",
    message:
      "Based on current conditions, there is a moderate risk of grain spoilage within 48 hours. Consider drying grains.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleString(),
  },
  {
    id: "4",
    type: "info",
    title: "System Update",
    message: "All sensors are functioning normally. Data sync completed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toLocaleString(),
  },
  {
    id: "5",
    type: "warning",
    title: "Gas Level Elevated",
    message:
      "Gas concentration at 0.35 ppm. Check for potential pest activity.",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toLocaleString(),
  },
];

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground">
          Monitor critical events and notifications
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            timestamp={alert.timestamp}
          />
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No alerts at this time. All systems normal.
          </p>
        </div>
      )}
    </div>
  );
}
