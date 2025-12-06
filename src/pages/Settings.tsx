import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsAPI, type SalonSettings } from "@/services/settings";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SalonSettings>({
    id: "",
    salonName: "",
    mainAddress: "",
    branchAddresses: [],
    phone: "",
    email: "",
    logoUrl: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.update({
        salonName: settings.salonName,
        mainAddress: settings.mainAddress,
        branchAddresses: settings.branchAddresses,
        phone: settings.phone,
        email: settings.email,
        logoUrl: settings.logoUrl,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addBranch = () => {
    setSettings({
      ...settings,
      branchAddresses: [...settings.branchAddresses, { branchName: "", address: "", email: "", phone: "" }],
    });
  };

  const removeBranch = (index: number) => {
    setSettings({
      ...settings,
      branchAddresses: settings.branchAddresses.filter((_, i) => i !== index),
    });
  };

  const updateBranch = (index: number, field: keyof typeof settings.branchAddresses[0], value: string) => {
    const updated = [...settings.branchAddresses];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({
      ...settings,
      branchAddresses: updated,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display mb-2">Salon Settings</h1>
        <p className="text-muted-foreground">
          Configure your salon information for invoices and receipts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            This information will appear on all printed invoices and thermal bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="salonName">Salon Name *</Label>
            <Input
              id="salonName"
              value={settings.salonName}
              onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
              placeholder="Enter salon name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@salon.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
            <Input
              id="logoUrl"
              value={settings.logoUrl || ""}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Main Address</CardTitle>
          <CardDescription>
            Primary salon location address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="mainAddress">Full Address *</Label>
            <Input
              id="mainAddress"
              value={settings.mainAddress}
              onChange={(e) => setSettings({ ...settings, mainAddress: e.target.value })}
              placeholder="123 Beauty Street, City, State - 400001"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Branch Details
              </CardTitle>
              <CardDescription>
                Add multiple branch locations with contact information (optional)
              </CardDescription>
            </div>
            <Button onClick={addBranch} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.branchAddresses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No branch details added. Click "Add Branch" to add locations.
            </p>
          ) : (
            settings.branchAddresses.map((branch, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6 space-y-4">
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => removeBranch(index)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`branchName-${index}`}>Branch Name *</Label>
                    <Input
                      id={`branchName-${index}`}
                      value={branch.branchName}
                      onChange={(e) => updateBranch(index, "branchName", e.target.value)}
                      placeholder="e.g., Downtown Branch, Mall Location"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`branchAddress-${index}`}>Address *</Label>
                    <Input
                      id={`branchAddress-${index}`}
                      value={branch.address}
                      onChange={(e) => updateBranch(index, "address", e.target.value)}
                      placeholder="123 Street, City, State - PIN"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`branchEmail-${index}`}>Email</Label>
                      <Input
                        id={`branchEmail-${index}`}
                        type="email"
                        value={branch.email}
                        onChange={(e) => updateBranch(index, "email", e.target.value)}
                        placeholder="branch@salon.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`branchPhone-${index}`}>Phone Number</Label>
                      <Input
                        id={`branchPhone-${index}`}
                        value={branch.phone}
                        onChange={(e) => updateBranch(index, "phone", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button onClick={loadSettings} variant="outline" disabled={saving}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
