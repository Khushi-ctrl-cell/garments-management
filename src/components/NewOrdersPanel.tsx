import { useOrders } from "@/hooks/useDatabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, DollarSign } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";

export const NewOrdersPanel = () => {
  const { orders, loading } = useOrders();

  const recentOrders = orders.slice(0, 5); // Show last 5 orders

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": 
      case "urgent": 
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": 
        return "bg-warning/10 text-warning border-warning/20";
      case "low": 
        return "bg-success/10 text-success border-success/20";
      default: 
        return "bg-muted/10 text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            New Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading orders...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          New Orders ({recentOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
            <p>No orders yet</p>
            <p className="text-sm">Create your first order to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {order.order_number}
                    </p>
                    <Badge className={getPriorityColor(order.priority)} variant="outline">
                      {order.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Qty: {order.quantity}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {order.total_amount ? formatINR(order.total_amount) : "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(order.created_at), 'MMM d, HH:mm')}
                  </div>
                </div>
                
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};