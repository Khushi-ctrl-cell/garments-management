import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Package, DollarSign, Clock, Edit2, Save, X, User, Phone, FileImage } from "lucide-react";
import { Order } from "@/hooks/useDatabase";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
}

export const OrderDetailDialog = ({ order, open, onOpenChange, onUpdateOrder }: OrderDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const canEdit = order.status === 'pending';
  const canChangeStatus = order.status !== 'completed';

  const handleEdit = () => {
    setIsEditing(true);
    setEditedOrder({
      order_number: order.order_number,
      description: order.description,
      quantity: order.quantity,
      total_amount: order.total_amount,
    });
  };

  const handleSave = async () => {
    if (!order) return;
    setLoading(true);
    try {
      await onUpdateOrder(order.id, editedOrder);
      setIsEditing(false);
      setEditedOrder({});
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setLoading(true);
    try {
      await onUpdateOrder(order.id, { status: newStatus as Order['status'] });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "in_progress": return "bg-warning/10 text-warning border-warning/20";
      case "pending": return "bg-muted/10 text-muted-foreground border-muted/20";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "urgent": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </DialogTitle>
            {canEdit && !isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {isEditing ? (
                  <Input
                    value={editedOrder.order_number || ''}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, order_number: e.target.value }))}
                    className="text-lg font-semibold"
                  />
                ) : (
                  order.order_number
                )}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(order.status)} variant="outline">
                  {order.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(order.priority)} variant="outline">
                  {order.priority}
                </Badge>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
              </div>
              {order.due_date && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Due: {format(new Date(order.due_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Quantity</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedOrder.quantity || ''}
                  onChange={(e) => setEditedOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm mt-1">{order.quantity}</p>
              )}
            </div>
            
            <div>
              <Label className="text-sm font-medium">Subtotal Amount</Label>
              <div className="flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3" />
                <p className="text-sm">{order.subtotal_amount ? formatINR(order.subtotal_amount) : "N/A"}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">GST (5%)</Label>
              <div className="flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3" />
                <p className="text-sm">{order.gst_amount ? formatINR(order.gst_amount) : "N/A"}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editedOrder.total_amount || ''}
                  onChange={(e) => setEditedOrder(prev => ({ ...prev, total_amount: parseFloat(e.target.value) }))}
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-3 w-3" />
                  <p className="text-sm font-medium">{order.total_amount ? formatINR(order.total_amount) : "N/A"}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedOrder.description || ''}
                onChange={(e) => setEditedOrder(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            ) : (
              <p className="text-sm mt-1 text-muted-foreground">
                {order.description || "No description provided"}
              </p>
            )}
          </div>

          {/* Creator Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Created By</Label>
              <div className="flex items-center gap-1 mt-1">
                <User className="h-3 w-3" />
                <p className="text-sm">{order.creator_name || "N/A"}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Creator Phone</Label>
              <div className="flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                <p className="text-sm">{order.creator_phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          {order.photo_urls && order.photo_urls.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Order Photos ({order.photo_urls.length})
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {order.photo_urls.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg border bg-muted overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <img
                      src={url}
                      alt={`Order photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() => window.open(url, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Management */}
          {canChangeStatus && !isEditing && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Change Status</Label>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange('in_progress')}
                        disabled={loading}
                      >
                        Mark as Processing
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange('completed')}
                        disabled={loading}
                      >
                        Mark as Completed
                      </Button>
                    </>
                  )}
                  {order.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange('completed')}
                      disabled={loading}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <>
              <Separator />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedOrder({});
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};