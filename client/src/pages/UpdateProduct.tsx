import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Minus, Trash2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  photoUrl: string;
}

const UpdateProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setEditedPrice(product.price);
    setShowUpdateDialog(true);
  };

  const handleIncrement = async () => {
    if (!selectedProduct) return;
    const updatedProduct = {
      ...selectedProduct,
      quantity: selectedProduct.quantity + 1,
      price: editedPrice,
    };
    await updateProductOnServer(updatedProduct);
  };

  const handleDecrement = async () => {
    if (!selectedProduct || selectedProduct.quantity <= 0) return;
    const updatedProduct = {
      ...selectedProduct,
      quantity: selectedProduct.quantity - 1,
      price: editedPrice,
    };
    await updateProductOnServer(updatedProduct);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`${apiUrl}/api/products/${selectedProduct._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedProducts = products.filter(p => p._id !== selectedProduct._id);
        setProducts(updatedProducts);
        setShowUpdateDialog(false);
        setSelectedProduct(null);
        toast({
          title: "Product deleted",
          description: `${selectedProduct.name} has been removed from inventory`,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    const updatedProduct = {
      ...selectedProduct,
      price: editedPrice,
    };
    await updateProductOnServer(updatedProduct);
    setShowUpdateDialog(false);
  };

  const updateProductOnServer = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`${apiUrl}/api/products/${updatedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: updatedProduct.price,
          quantity: updatedProduct.quantity,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedProducts = products.map(p =>
          p._id === updated._id ? updated : p
        );
        setProducts(updatedProducts);
        setSelectedProduct(updated);
        toast({
          title: "Product updated",
          description: `${updated.name} updated successfully.`,
        });
      } else {
        console.error("Failed to update product:", await res.text());
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <Button variant="outline" onClick={() => navigate('/owner-dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Update Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No products found</p>
                <Button onClick={() => navigate('/add-product')}>Add Your First Product</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product._id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleProductSelect(product)} variant="outline" size="sm">
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate('/owner-dashboard')}>
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>

      {selectedProduct && (
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update {selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <img
                  src={selectedProduct.photoUrl}
                  alt={selectedProduct.name}
                  className="h-40 w-40 object-cover rounded-md"
                />
              </div>

              <div className="text-center">
                <label className="font-semibold">Price (₹): </label>
                <input
                  type="number"
                  className="border p-1 rounded w-24 text-center"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={selectedProduct.quantity <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-bold w-10 text-center">
                  {selectedProduct.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DialogFooter className="flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button onClick={handleUpdateProduct}>
                  Save Changes
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowUpdateDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpdateProduct;
