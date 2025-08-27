import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskManager } from "@/components/TaskManager";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ClientForm } from "@/components/ClientForm";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Users, ClipboardList } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showClientForm, setShowClientForm] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">A to Z Garments Track</h1>
              <p className="text-muted-foreground">Manage your garment orders and tasks efficiently</p>
            </div>
            <Button 
              onClick={() => setShowClientForm(true)}
              className="gradient-primary text-white shadow-glow transition-smooth hover:shadow-large"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card border shadow-soft">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clients
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <TabsContent value="dashboard" className="space-y-6 mt-0">
                  <DashboardStats />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TaskManager />
                    <PerformanceChart />
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-0">
                  <TaskManager expanded />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <PerformanceChart expanded />
                </TabsContent>

                <TabsContent value="clients" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Client Management</h3>
                      <p className="text-muted-foreground">Client management features coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              <div className="lg:col-span-1">
                <NotificationPanel />
              </div>
            </div>
          </Tabs>

          <ClientForm 
            open={showClientForm} 
            onOpenChange={setShowClientForm}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;