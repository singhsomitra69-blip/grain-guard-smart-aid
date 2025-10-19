import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface PredictionResult {
  risk: "low" | "medium" | "high";
  confidence: number;
  recommendation: string;
  factors: string[];
}

// Simulated AI prediction
const prediction: PredictionResult = {
  risk: "medium",
  confidence: 78,
  recommendation:
    "Consider increasing ventilation and monitoring humidity levels closely. Dry grains if humidity exceeds 65% for extended periods.",
  factors: [
    "Humidity levels trending upward",
    "Temperature within acceptable range",
    "Slight gas elevation detected",
    "Normal vibration activity",
  ],
};

const riskConfig = {
  low: {
    icon: CheckCircle,
    badge: "Low Risk",
    badgeVariant: "default" as const,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  medium: {
    icon: AlertTriangle,
    badge: "Medium Risk",
    badgeVariant: "secondary" as const,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
  high: {
    icon: AlertTriangle,
    badge: "High Risk",
    badgeVariant: "destructive" as const,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
};

export default function Prediction() {
  const config = riskConfig[prediction.risk];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Prediction</h1>
        <p className="text-muted-foreground">
          AI-powered spoilage risk analysis
        </p>
      </div>

      <Card className={`p-8 border-2 ${config.borderColor} ${config.bgColor}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-lg bg-background ${config.color}`}>
            <Brain className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">Spoilage Risk Assessment</h2>
              <Badge variant={config.badgeVariant}>{config.badge}</Badge>
            </div>
            <p className="text-muted-foreground">
              Based on current sensor data and historical patterns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-2xl font-bold">{prediction.confidence}%</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full ${config.bgColor.replace('/10', '')}`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Icon className={`h-12 w-12 ${config.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className={`text-xl font-bold ${config.color}`}>
                {prediction.risk.charAt(0).toUpperCase() + prediction.risk.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Key Factors</h3>
        </div>
        <ul className="space-y-3">
          {prediction.factors.map((factor, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
              <span className="text-muted-foreground">{factor}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recommended Actions
        </h3>
        <p className="text-foreground mb-4">{prediction.recommendation}</p>
        <div className="flex gap-3">
          <Button>View Detailed Analysis</Button>
          <Button variant="outline">Export Report</Button>
        </div>
      </Card>
    </div>
  );
}
