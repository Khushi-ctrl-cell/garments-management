import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useNotifications } from './useNotifications';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  order_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  user_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  description?: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_id?: string;
  due_date?: string;
  total_amount?: number;
  subtotal_amount?: number;
  gst_amount?: number;
  creator_name?: string;
  creator_phone?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data as Task[] || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.log('No user found - not authenticated');
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to add tasks.",
      });
      return;
    }

    console.log('Attempting to add task:', task, 'User ID:', user.id);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data as Task, ...prev]);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again.",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === id ? data as Task : task));
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again.",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as Order[] || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => [data as Order, ...prev]);
      
      // Add notification for new order
      addNotification({
        type: "success",
        title: "New Order Created",
        message: `Order ${data.order_number} has been created successfully.`,
      });
      
      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error adding order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order. Please try again.",
      });
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const oldOrder = orders.find(o => o.id === id);
      setOrders(prev => prev.map(order => order.id === id ? data as Order : order));
      
      // Add notification for status change
      if (updates.status && oldOrder?.status !== updates.status) {
        const statusMessages = {
          'pending': 'Order is now pending',
          'in_progress': 'Order is now being processed',
          'completed': 'Order has been completed',
          'cancelled': 'Order has been cancelled',
        };
        
        addNotification({
          type: updates.status === 'completed' ? "success" : "info",
          title: "Order Status Updated",
          message: `Order ${data.order_number}: ${statusMessages[updates.status as keyof typeof statusMessages]}`,
        });
      }
      
      toast({
        title: "Order updated",
        description: "Order has been updated successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order. Please try again.",
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.description?.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      new Date(order.created_at).toLocaleDateString().includes(query)
    );
  });

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders: filteredOrders,
    loading,
    searchQuery,
    setSearchQuery,
    addOrder,
    updateOrder,
    refetch: fetchOrders,
  };
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load clients. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [data, ...prev]);
      toast({
        title: "Client added",
        description: "Client has been added successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add client. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  return {
    clients,
    loading,
    addClient,
    refetch: fetchClients,
  };
}