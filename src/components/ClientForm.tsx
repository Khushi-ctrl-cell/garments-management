import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Building2, Mail, Phone, DollarSign, Camera, Upload, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrders, useClients } from "@/hooks/useDatabase";
import { formatINR, calculateGST } from "@/lib/utils";
import { PhotoUpload } from "./PhotoUpload";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

export const ClientForm = ({ open, onOpenChange }: ClientFormProps) => {
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const { addClient } = useClients();
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    orderType: "",
    priority: "medium",
    notes: "",
    expectedDelivery: "",
    creatorName: "",
    creatorPhone: "",
  });

  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState({
    product: "",
    quantity: 1,
    price: 0,
  });

  const addOrderItem = () => {
    if (newItem.product.trim()) {
      const item: OrderItem = {
        id: Date.now().toString(),
        ...newItem,
      };
      setOrderItems([...orderItems, item]);
      setNewItem({ product: "", quantity: 1, price: 0 });
    }
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const subtotalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const { subtotal, gst, total } = calculateGST(subtotalAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, create or find client
      const clientData = {
        name: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };
      
      const client = await addClient(clientData);
      
      // Then create the order
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        description: `${formData.orderType} - ${formData.notes}`,
        quantity: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        status: 'pending' as const,
        priority: formData.priority as 'low' | 'medium' | 'high',
        client_id: client?.id,
        due_date: formData.expectedDelivery || null,
        subtotal_amount: subtotal,
        gst_amount: gst,
        total_amount: total,
        creator_name: formData.creatorName,
        creator_phone: formData.creatorPhone,
        photo_urls: photoUrls,
      };
      
      await addOrder(orderData);
      
      // Reset form
      setFormData({
        clientName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        orderType: "",
        priority: "medium",
        notes: "",
        expectedDelivery: "",
        creatorName: "",
        creatorPhone: "",
      });
      setOrderItems([]);
      setPhotoUrls([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order. Please try again.",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Create New Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <h3 className="col-span-full text-lg font-medium mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Client Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="client@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="col-span-full space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter client address"
                rows={2}
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <h3 className="col-span-full text-lg font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Order Details
            </h3>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={formData.orderType} onValueChange={(value) => setFormData({...formData, orderType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-sale">Product Sale</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="custom">Custom Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
              />
            </div>
          </div>

          {/* Creator Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <h3 className="col-span-full text-lg font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Order Creator Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="creatorName">Your Name *</Label>
              <Input
                id="creatorName"
                value={formData.creatorName}
                onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creatorPhone">Your Phone *</Label>
              <Input
                id="creatorPhone"
                value={formData.creatorPhone}
                onChange={(e) => setFormData({...formData, creatorPhone: e.target.value})}
                required
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Order Documents/Photos
            </h3>
            <PhotoUpload
              photoUrls={photoUrls}
              onPhotosChange={setPhotoUrls}
              uploading={uploadingPhoto}
              onUploadingChange={setUploadingPhoto}
            />
          </div>

          {/* Order Items */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <Input
                placeholder="Product/Service"
                value={newItem.product}
                onChange={(e) => setNewItem({...newItem, product: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Quantity"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              />
                <Input
                  type="number"
                  placeholder="Unit Price (₹)"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                />
              <Button type="button" onClick={addOrderItem} className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {orderItems.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Unit Price</span>
                  <span>Total</span>
                  <span>Action</span>
                </div>
                {orderItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 gap-2 items-center text-sm">
                    <span>{item.product}</span>
                    <span>{item.quantity}</span>
                    <span>{formatINR(item.price)}</span>
                    <span className="font-medium">{formatINR(item.quantity * item.price)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrderItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="border-t pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (5%):</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special requirements or notes..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Badge className={getPriorityColor(formData.priority)}>
                {formData.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">Items:</span>
              <span className="font-medium">{orderItems.length}</span>
            </div>
            <div className="text-xl font-bold text-primary">
              Total: {formatINR(total)}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-white">
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};