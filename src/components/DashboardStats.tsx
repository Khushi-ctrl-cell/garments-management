import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Total Sales",
    value: "₹0",
    change: "0%",
    changeType: "neutral" as const,
    icon: DollarSign,
    color: "success"
  },
  {
    title: "Pending Orders",
    value: "0",
    change: "0",
    changeType: "neutral" as const,
    icon: Clock,
    color: "warning"
  },
  {
    title: "Completed Tasks",
    value: "0",
    change: "0%",
    changeType: "neutral" as const,
    icon: CheckCircle,
    color: "success"
  },
  {
    title: "Overdue Items",
    value: "0",
    change: "0",
    changeType: "neutral" as const,
    icon: AlertCircle,
    color: "destructive"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs flex items-center text-muted-foreground">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'success' 
                    ? 'bg-success-light' 
                    : stat.color === 'warning'
                    ? 'bg-warning-light'
                    : stat.color === 'destructive'
                    ? 'bg-destructive/10'
                    : 'bg-primary-light'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    stat.color === 'success'
                      ? 'text-success'
                      : stat.color === 'warning'
                      ? 'text-warning'
                      : stat.color === 'destructive'
                      ? 'text-destructive'
                      : 'text-primary'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};