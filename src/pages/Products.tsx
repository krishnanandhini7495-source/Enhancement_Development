import { useEffect, useState } from "react";
import { productsAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  active: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock_quantity: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.stock_quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stock_quantity),
          active: editingProduct.active
        });
        toast.success("Product updated successfully");
      } else {
        await productsAPI.create({
          name: formData.name,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stock_quantity),
        });
        toast.success("Product added successfully");
      }

      setDialogOpen(false);
      setFormData({ name: "", price: "", stock_quantity: "" });
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
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productsAPI.update(product.id, {
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
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
          <p className="text-muted-foreground">Manage your salon products</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: "", price: "", stock_quantity: "" });
              }}
              className="gradient-primary hover:opacity-90 transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  placeholder="50"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">₹{Number(product.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stockQuantity}</TableCell>
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
          {products.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No products found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
