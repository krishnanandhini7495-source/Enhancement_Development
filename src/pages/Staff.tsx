import { useEffect, useState } from "react";
import { staffAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface StaffMember {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  aadharNumber: string | null;
  active: boolean;
}

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", aadharNumber: "" });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await staffAPI.getAll();
      setStaff(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter staff name");
      return;
    }

    try {
      if (editingStaff) {
        await staffAPI.update(editingStaff.id, {
          name: formData.name,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          aadharNumber: formData.aadharNumber || undefined,
          active: editingStaff.active
        });
        toast.success("Staff member updated successfully");
      } else {
        await staffAPI.create({
          name: formData.name,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          address: formData.address || undefined,
          aadharNumber: formData.aadharNumber || undefined,
        });
        toast.success("Staff member added successfully");
      }

      setDialogOpen(false);
      setFormData({ name: "", phone: "", email: "", address: "", aadharNumber: "" });
      setEditingStaff(null);
      fetchStaff();
    } catch (error: any) {
      console.error("Error saving staff:", error);
      toast.error(error.message || "Failed to save staff member");
    }
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      phone: staffMember.phone || "",
      email: staffMember.email || "",
      address: staffMember.address || "",
      aadharNumber: staffMember.aadharNumber || "",
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (staffMember: StaffMember) => {
    try {
      await staffAPI.update(staffMember.id, {
        name: staffMember.name,
        phone: staffMember.phone || undefined,
        email: staffMember.email || undefined,
        address: staffMember.address || undefined,
        aadharNumber: staffMember.aadharNumber || undefined,
        active: !staffMember.active
      });
      toast.success(`Staff member ${!staffMember.active ? "activated" : "deactivated"}`);
      fetchStaff();
    } catch (error: any) {
      console.error("Error toggling staff:", error);
      toast.error(error.message || "Failed to update staff member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await staffAPI.delete(id);
      toast.success("Staff member deleted successfully");
      fetchStaff();
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      toast.error(error.message || "Failed to delete staff member");
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
          <h1 className="text-3xl font-display mb-2">Staff</h1>
          <p className="text-muted-foreground">Manage your salon staff</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingStaff(null);
                setFormData({ name: "", phone: "", email: "", address: "", aadharNumber: "" });
              }}
              className="gradient-primary hover:opacity-90 transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                  placeholder="1234 5678 9012"
                  maxLength={12}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingStaff ? "Update" : "Add"} Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Aadhar Number</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.phone || "-"}</TableCell>
                  <TableCell>{member.email || "-"}</TableCell>
                  <TableCell>{member.address || "-"}</TableCell>
                  <TableCell>{member.aadharNumber || "-"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={member.active}
                        onCheckedChange={() => handleToggleActive(member)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {staff.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No staff members found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
