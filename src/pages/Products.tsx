import { useEffect, useState } from "react";
import { productsAPI } from "@/services/api";
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

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  openingStockQuantity?: number;
  openingStockDate?: string;
  currentStockQuantity?: number;
  currentStockDate?: string;
  productWeightUnit?: string;
  productWeight?: number;
  active: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    stock_quantity: "",
    opening_stock_quantity: "",
    opening_stock_date: "",
    current_stock_quantity: "",
    current_stock_date: "",
    product_weight_unit: "count",
    product_weight: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await productsAPI.exportToCsv();
      toast.success("Products exported successfully");
    } catch (error) {
      console.error("Error exporting products:", error);
      toast.error("Failed to export products");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.stock_quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stock_quantity),
        openingStockQuantity: formData.opening_stock_quantity ? parseInt(formData.opening_stock_quantity) : undefined,
        openingStockDate: formData.opening_stock_date || undefined,
        currentStockQuantity: formData.current_stock_quantity ? parseInt(formData.current_stock_quantity) : undefined,
        currentStockDate: formData.current_stock_date || undefined,
        productWeightUnit: formData.product_weight_unit || undefined,
        productWeight: formData.product_weight ? parseFloat(formData.product_weight) : undefined,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, {
          ...productData,
          active: editingProduct.active
        });
        toast.success("Product updated successfully");
      } else {
        await productsAPI.create(productData);
        toast.success("Product added successfully");
      }

      setDialogOpen(false);
      setFormData({ 
        name: "", 
        price: "", 
        stock_quantity: "",
        opening_stock_quantity: "",
        opening_stock_date: "",
        current_stock_quantity: "",
        current_stock_date: "",
        product_weight_unit: "count",
        product_weight: ""
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock_quantity: product.stockQuantity.toString(),
      opening_stock_quantity: product.openingStockQuantity?.toString() || "",
      opening_stock_date: product.openingStockDate?.split('T')[0] || "",
      current_stock_quantity: product.currentStockQuantity?.toString() || "",
      current_stock_date: product.currentStockDate?.split('T')[0] || "",
      product_weight_unit: product.productWeightUnit || "count",
      product_weight: product.productWeight?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productsAPI.update(product.id, {
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        openingStockQuantity: product.openingStockQuantity,
        openingStockDate: product.openingStockDate,
        currentStockQuantity: product.currentStockQuantity,
        currentStockDate: product.currentStockDate,
        productWeightUnit: product.productWeightUnit,
        productWeight: product.productWeight,
        active: !product.active
      });
      toast.success(`Product ${!product.active ? "activated" : "deactivated"}`);
      fetchProducts();
    } catch (error: any) {
      console.error("Error toggling product:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productsAPI.delete(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
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
          <h1 className="text-3xl font-display mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your salon products and inventory</p>
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
                  setEditingProduct(null);
                  setFormData({ 
                    name: "", 
                    price: "", 
                    stock_quantity: "",
                    opening_stock_quantity: "",
                    opening_stock_date: "",
                    current_stock_quantity: "",
                    current_stock_date: "",
                    product_weight_unit: "count",
                    product_weight: ""
                  });
                }}
                className="gradient-primary hover:opacity-90 transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Hair Oil"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-3">Stock Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opening_stock_quantity">Opening Stock Quantity</Label>
                      <Input
                        id="opening_stock_quantity"
                        type="number"
                        value={formData.opening_stock_quantity}
                        onChange={(e) => setFormData({ ...formData, opening_stock_quantity: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="opening_stock_date">Opening Stock Date</Label>
                      <Input
                        id="opening_stock_date"
                        type="date"
                        value={formData.opening_stock_date}
                        onChange={(e) => setFormData({ ...formData, opening_stock_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current_stock_quantity">Current Stock Quantity</Label>
                      <Input
                        id="current_stock_quantity"
                        type="number"
                        value={formData.current_stock_quantity}
                        onChange={(e) => setFormData({ ...formData, current_stock_quantity: e.target.value })}
                        placeholder="75"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current_stock_date">Current Stock Date</Label>
                      <Input
                        id="current_stock_date"
                        type="date"
                        value={formData.current_stock_date}
                        onChange={(e) => setFormData({ ...formData, current_stock_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_weight_unit">Unit</Label>
                      <Select 
                        value={formData.product_weight_unit} 
                        onValueChange={(value) => setFormData({ ...formData, product_weight_unit: value })}
                      >
                        <SelectTrigger id="product_weight_unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gm">Grams (gm)</SelectItem>
                          <SelectItem value="ml">Milliliters (ml)</SelectItem>
                          <SelectItem value="count">Count/Pieces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">₹{Number(product.price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {product.openingStockQuantity !== null && product.openingStockQuantity !== undefined ? product.openingStockQuantity : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.currentStockQuantity !== null && product.currentStockQuantity !== undefined ? (
                        <span className={
                          (product.productWeightUnit === 'gm' && product.currentStockQuantity < 50) ||
                          (product.productWeightUnit === 'ml' && product.currentStockQuantity < 50) ||
                          (product.productWeightUnit === 'count' && product.currentStockQuantity < 5)
                            ? 'text-red-600 font-semibold'
                            : ''
                        }>
                          {product.currentStockQuantity}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{product.productWeightUnit || '-'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={product.active}
                          onCheckedChange={() => handleToggleActive(product)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
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
          {products.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No products found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
