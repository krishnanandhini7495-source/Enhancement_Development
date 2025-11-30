import { useEffect, useState } from "react";
import { dashboardAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Package, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  todaySales: number;
  todayInvoices: number;
  totalServices: number;
  totalProducts: number;
  totalStaff: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayInvoices: 0,
    totalServices: 0,
    totalProducts: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard mounted, user:", user);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      // Set default values if API fails
      setStats({
        todaySales: 0,
        todayInvoices: 0,
        totalServices: 0,
        totalProducts: 0,
        totalStaff: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your salon overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todaySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.todayInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Today</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayInvoices}</div>
            <p className="text-xs text-muted-foreground">Processed today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
