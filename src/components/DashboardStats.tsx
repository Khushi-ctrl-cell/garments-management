import { useTasks, useOrders } from "@/hooks/useDatabase";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const DashboardStats = () => {
  const { tasks } = useTasks();
  const { orders } = useOrders();

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const stats = [
    {
      title: "Total Sales",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `${completedOrders} orders`,
      changeType: "neutral" as const,
      icon: DollarSign,
      color: "success"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      change: `${orders.length} total`,
      changeType: "neutral" as const,
      icon: Clock,
      color: "warning"
    },
    {
      title: "Completed Tasks",
      value: completedTasks.toString(),
      change: `${tasks.length} total tasks`,
      changeType: "neutral" as const,
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Active Orders",
      value: orders.length.toString(),
      change: `${completedOrders} completed`,
      changeType: "neutral" as const,
      icon: AlertCircle,
      color: "destructive"
    }
  ];

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
                    {stat.change}
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