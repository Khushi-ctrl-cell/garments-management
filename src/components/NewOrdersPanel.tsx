import { useState } from "react";
import { useOrders } from "@/hooks/useDatabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Package, DollarSign, Search, Eye, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { Order } from "@/hooks/useDatabase";

export const NewOrdersPanel = () => {
  const { orders, loading, searchQuery, setSearchQuery, updateOrder, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const recentOrders = orders.slice(0, 10); // Show last 10 orders

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": 
        return "bg-success/10 text-success border-success/20";
      case "in_progress": 
        return "bg-warning/10 text-warning border-warning/20";
      case "pending": 
        return "bg-muted/10 text-muted-foreground border-muted/20";
      case "cancelled": 
        return "bg-destructive/10 text-destructive border-destructive/20";
      default: 
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    await updateOrder(orderId, updates);
    // Refresh the selected order data
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeletingOrderId(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = async () => {
    if (deletingOrderId) {
      await deleteOrder(deletingOrderId);
      setDeletingOrderId(null);
      setShowDeleteConfirm(false);
      // Close order detail if it was the deleted order
      if (selectedOrder && selectedOrder.id === deletingOrderId) {
        setShowOrderDetail(false);
        setSelectedOrder(null);
      }
    }
  };

  if (loading) {
    return (
      <Card className="shadow-soft">
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
    <>
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              New Orders ({recentOrders.length})
            </CardTitle>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, product, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
              <p>No orders found</p>
              {searchQuery ? (
                <p className="text-sm">Try adjusting your search criteria</p>
              ) : (
                <p className="text-sm">Create your first order to get started</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer group"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm truncate">
                        {order.order_number}
                      </p>
                      <Badge className={getPriorityColor(order.priority)} variant="outline">
                        {order.priority}
                      </Badge>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {order.description && (
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {order.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Qty: {order.quantity}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {order.total_amount ? formatINR(order.total_amount) : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(order.created_at), 'MMM d, HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === 'pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {orders.length > 10 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing 10 of {orders.length} orders
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        open={showOrderDetail}
        onOpenChange={setShowOrderDetail}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
      
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};