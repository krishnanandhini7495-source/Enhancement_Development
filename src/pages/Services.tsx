import { useEffect, useState } from "react";
import { servicesAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Service {
  id: string;
  name: string;
  basePrice: number;
  active: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", base_price: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.base_price) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, {
          name: formData.name,
          basePrice: parseFloat(formData.base_price),
          active: editingService.active
        });
        toast.success("Service updated successfully");
      } else {
        await servicesAPI.create({
          name: formData.name,
          basePrice: parseFloat(formData.base_price),
        });
        toast.success("Service added successfully");
      }

      setDialogOpen(false);
      setFormData({ name: "", base_price: "" });
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      console.error("Error saving service:", error);
      toast.error(error.message || "Failed to save service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      base_price: service.basePrice.toString(),
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesAPI.update(service.id, {
        name: service.name,
        basePrice: service.basePrice,
        active: !service.active
      });
      toast.success(`Service ${!service.active ? "activated" : "deactivated"}`);
      fetchServices();
    } catch (error: any) {
      console.error("Error toggling service:", error);
      toast.error(error.message || "Failed to update service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await servicesAPI.delete(id);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display mb-2">Services</h1>
          <p className="text-muted-foreground">Manage your salon services</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingService(null);
                setFormData({ name: "", base_price: "" });
              }}
              className="gradient-primary hover:opacity-90 transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Haircut"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (₹) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="500"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingService ? "Update" : "Add"} Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Base Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="text-right">₹{Number(service.basePrice).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => handleToggleActive(service)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {services.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No services found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
