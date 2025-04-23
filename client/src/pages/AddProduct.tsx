
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AddProduct = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this to an API
    // For now, we'll use localStorage to simulate a database
    const newProduct = {
      id: productId,
      name: productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
      photoUrl: photoUrl || 'https://placehold.co/400x300?text=Product+Image',
      createdAt: new Date().toISOString()
    };
    await fetch('https://9882-2409-40f4-315e-eff1-f92d-f48d-2c52-297a.ngrok-free.app/api/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Check if product ID already exists
    if (products.some((p: any) => p.id === productId)) {
      toast({
        title: "Error",
        description: "Product ID already exists",
        variant: "destructive",
      });
      return;
    }
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    toast({
      title: "Success",
      description: "Product added successfully",
    });
    
    // Reset form
    setProductId('');
    setProductName('');
    setPrice('');
    setQuantity('');
    setDescription('');
    setPhotoUrl('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
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
            <CardTitle className="text-xl">Add New Product</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input 
                  id="productId" 
                  placeholder="Enter a unique product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input 
                  id="productName" 
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Available Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input 
                  id="photoUrl" 
                  placeholder="Enter URL for product image"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">Leave empty to use a placeholder image</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/owner-dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
