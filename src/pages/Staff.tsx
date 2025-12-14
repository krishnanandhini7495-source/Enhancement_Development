import { useEffect, useState } from "react";
import { staffAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface SalaryHistory {
  id: string;
  staffId: string;
  basicSalary: number;
  effectiveFromDate: string;
  effectiveToDate: string | null;
  createdAt: string;
}

interface StaffMember {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  aadharNumber: string | null;
  staffCategory: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  ifscCode: string | null;
  currentSalary: SalaryHistory | null;
  active: boolean;
}

const STAFF_CATEGORIES = [
  "Creative Director",
  "Top Stylist",
  "Senior Stylist",
  "Stylist",
  "Beautician",
  "Senior Beautician",
  "Therapist"
];

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    address: "", 
    aadharNumber: "",
    staffCategory: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    basicSalary: "",
    salaryEffectiveDate: ""
  });

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
          staffCategory: formData.staffCategory || undefined,
          bankName: formData.bankName || undefined,
          bankAccountNumber: formData.bankAccountNumber || undefined,
          ifscCode: formData.ifscCode || undefined,
          basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
          salaryEffectiveDate: formData.salaryEffectiveDate || undefined,
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
          staffCategory: formData.staffCategory || undefined,
          bankName: formData.bankName || undefined,
          bankAccountNumber: formData.bankAccountNumber || undefined,
          ifscCode: formData.ifscCode || undefined,
          basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
          salaryEffectiveDate: formData.salaryEffectiveDate || undefined,
        });
        toast.success("Staff member added successfully");
      }

      setDialogOpen(false);
      setFormData({ 
        name: "", 
        phone: "", 
        email: "", 
        address: "", 
        aadharNumber: "",
        staffCategory: "",
        bankName: "",
        bankAccountNumber: "",
        ifscCode: "",
        basicSalary: "",
        salaryEffectiveDate: ""
      });
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
      staffCategory: staffMember.staffCategory || "",
      bankName: staffMember.bankName || "",
      bankAccountNumber: staffMember.bankAccountNumber || "",
      ifscCode: staffMember.ifscCode || "",
      basicSalary: staffMember.currentSalary?.basicSalary.toString() || "",
      salaryEffectiveDate: staffMember.currentSalary?.effectiveFromDate ? new Date(staffMember.currentSalary.effectiveFromDate).toISOString().split('T')[0] : ""
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
        staffCategory: staffMember.staffCategory || undefined,
        bankName: staffMember.bankName || undefined,
        bankAccountNumber: staffMember.bankAccountNumber || undefined,
        ifscCode: staffMember.ifscCode || undefined,
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

  const handleExportCSV = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Staff/export/csv");
      if (!response.ok) throw new Error("Failed to export");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `staff_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Staff list exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export staff list");
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
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-smooth"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingStaff(null);
                  setFormData({ 
                    name: "", 
                    phone: "", 
                    email: "", 
                    address: "", 
                    aadharNumber: "",
                    staffCategory: "",
                    bankName: "",
                    bankAccountNumber: "",
                    ifscCode: "",
                    basicSalary: "",
                    salaryEffectiveDate: ""
                  });
                }}
                className="gradient-primary hover:opacity-90 transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
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
                  <Label htmlFor="staffCategory">Staff Category</Label>
                  <Select 
                    value={formData.staffCategory} 
                    onValueChange={(value) => setFormData({ ...formData, staffCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
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
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4">Salary Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      step="0.01"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                      placeholder="30000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salaryEffectiveDate">Effective Date</Label>
                    <Input
                      id="salaryEffectiveDate"
                      type="date"
                      value={formData.salaryEffectiveDate}
                      onChange={(e) => setFormData({ ...formData, salaryEffectiveDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="State Bank of India"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                    <Input
                      id="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      placeholder="1234567890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      placeholder="SBIN0001234"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingStaff ? "Update" : "Add"} Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.staffCategory || "-"}</TableCell>
                    <TableCell>{member.phone || "-"}</TableCell>
                    <TableCell>{member.email || "-"}</TableCell>
                    <TableCell>
                      {member.currentSalary ? `₹${member.currentSalary.basicSalary.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>{member.bankName || "-"}</TableCell>
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
          </div>
          {staff.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No staff members found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
