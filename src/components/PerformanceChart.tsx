import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, orders: 120, target: 50000 },
  { month: 'Feb', sales: 52000, orders: 135, target: 50000 },
  { month: 'Mar', sales: 48000, orders: 128, target: 50000 },
  { month: 'Apr', sales: 61000, orders: 165, target: 55000 },
  { month: 'May', sales: 55000, orders: 142, target: 55000 },
  { month: 'Jun', sales: 67000, orders: 178, target: 60000 },
];

const weeklyData = [
  { day: 'Mon', calls: 24, meetings: 8, deals: 3 },
  { day: 'Tue', calls: 31, meetings: 12, deals: 5 },
  { day: 'Wed', calls: 28, meetings: 10, deals: 2 },
  { day: 'Thu', calls: 35, meetings: 15, deals: 7 },
  { day: 'Fri', calls: 42, meetings: 18, deals: 9 },
  { day: 'Sat', calls: 18, meetings: 6, deals: 2 },
  { day: 'Sun', calls: 12, meetings: 3, deals: 1 },
];

interface PerformanceChartProps {
  expanded?: boolean;
}

export const PerformanceChart = ({ expanded = false }: PerformanceChartProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-medium)'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'sales' || name === 'target' ? `$${value.toLocaleString()}` : value,
                    name === 'sales' ? 'Sales' : name === 'target' ? 'Target' : 'Orders'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fill="url(#targetGradient)"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {expanded && (
        <Card className="shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-medium)'
                    }}
                  />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="meetings" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deals" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Calls</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Meetings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-muted-foreground">Deals</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};