
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Minus, Trash2 } from "lucide-react";

interface Product {
  id: string;
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowUpdateDialog(true);
  };

  const handleIncrement = () => {
    if (!selectedProduct) return;
    
    const updatedProduct = { ...selectedProduct, quantity: selectedProduct.quantity + 1 };
    updateProductInStorage(updatedProduct);
  };

  const handleDecrement = () => {
    if (!selectedProduct || selectedProduct.quantity <= 0) return;
    
    const updatedProduct = { ...selectedProduct, quantity: selectedProduct.quantity - 1 };
    updateProductInStorage(updatedProduct);
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    
    const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    setProducts(updatedProducts);
    setShowUpdateDialog(false);
    setSelectedProduct(null);
    
    toast({
      title: "Product deleted",
      description: `${selectedProduct.name} has been removed from inventory`,
    });
  };

  const updateProductInStorage = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    setSelectedProduct(updatedProduct);
    
    toast({
      title: "Product updated",
      description: `${updatedProduct.name} quantity is now ${updatedProduct.quantity}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/owner-dashboard')}
          >
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
                <Button onClick={() => navigate('/add-product')}>
                  Add Your First Product
                </Button>
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
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleProductSelect(product)}
                          variant="outline"
                          size="sm"
                        >
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
            <Button 
              variant="outline"
              onClick={() => navigate('/owner-dashboard')}
            >
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
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center">
                <img 
                  src={selectedProduct.photoUrl} 
                  alt={selectedProduct.name}
                  className="h-40 w-40 object-cover rounded-md"
                />
              </div>
              
              <div>
                <p className="font-semibold">Current quantity: {selectedProduct.quantity}</p>
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
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
              <Button 
                onClick={() => setShowUpdateDialog(false)}
                className="w-full sm:w-auto"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpdateProduct;
