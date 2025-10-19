import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Bell,
  BarChart3,
  Brain,
  Settings,
  Wheat,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Brain, label: "AI Prediction", path: "/prediction" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:relative md:border-t-0 md:border-r md:w-64 md:min-h-screen md:p-6">
      <div className="hidden md:flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary rounded-lg">
          <Wheat className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">GrainGuard</h1>
      </div>

      <div className="flex md:flex-col gap-2 justify-around md:justify-start">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
