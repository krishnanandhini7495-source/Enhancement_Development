import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Receipt, Briefcase, Package, Users, LogOut, Scissors, Settings, FileText } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, userRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-display text-primary">Elegant Salon</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
              <LayoutDashboard className="h-4 w-4 inline mr-2" />
              Dashboard
            </NavLink>
            <NavLink to="/billing" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
              <Receipt className="h-4 w-4 inline mr-2" />
              Billing
            </NavLink>
            {userRole === "admin" && (
              <>
                <NavLink to="/services" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  <Briefcase className="h-4 w-4 inline mr-2" />
                  Services
                </NavLink>
                <NavLink to="/products" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  <Package className="h-4 w-4 inline mr-2" />
                  Products
                </NavLink>
                <NavLink to="/staff" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  <Users className="h-4 w-4 inline mr-2" />
                  Staff
                </NavLink>
                <NavLink to="/reports" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Reports
                </NavLink>
                <NavLink to="/settings" className="text-sm font-medium hover:text-primary transition-smooth" activeClassName="text-primary">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Settings
                </NavLink>
              </>
            )}
          </nav>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
