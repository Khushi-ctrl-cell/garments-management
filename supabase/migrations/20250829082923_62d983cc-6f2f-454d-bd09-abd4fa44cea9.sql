-- Add GST and creator info fields to orders table
ALTER TABLE public.orders 
ADD COLUMN subtotal_amount numeric,
ADD COLUMN gst_amount numeric DEFAULT 0,
ADD COLUMN creator_name text,
ADD COLUMN creator_phone text,
ADD COLUMN photo_urls text[] DEFAULT '{}';

-- Create order_items table for detailed item breakdown
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own order items" 
ON public.order_items 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own order items" 
ON public.order_items 
FOR DELETE 
USING (user_id = auth.uid());

-- Create trigger for order_items updated_at
CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();