
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  photoUrl: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const CustomerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if logged in
    const storedCustomer = localStorage.getItem('currentCustomer');
    if (!storedCustomer) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate('/customer-login');
      return;
    }
  
    setCustomer(JSON.parse(storedCustomer));
  
    // Fetch products from the backend instead of localStorage
    const fetchProducts = async () => {
      try {

        const res = await fetch('  https://3670-103-196-28-179.ngrok-free.app/api/products',
          {
            headers: {
            'ngrok-skip-browser-warning': 'true'  // This bypasses the warning
          }
      });
        if (!res.ok) {
          throw new Error('Failed to fetch products from the server');
        }
        const data = await res.json();
        setProducts(data);  // Store the products from the backend
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Could not load products",
          variant: "destructive",
        });
      }
    };
  
    fetchProducts(); 
  }, [navigate, toast]);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderDialog(true);
    setOrderMessage(`Hello, I'm interested in purchasing "${product.name}" (ID: ${product.id}). Please provide details on availability and payment options.`);
  };

  const handleOrderSubmit = () => {
    if (!customer || !selectedProduct) return;
    
    // In a real app, we would call an API to send an email
    // For this demo, we'll show a success message
    
    toast({
      title: "Order inquiry sent",
      description: "The owner will contact you soon regarding your order",
    });
    
    setShowOrderDialog(false);
    setSelectedProduct(null);
    setOrderMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <div className="flex gap-2">
            {customer && (
              <span className="hidden md:inline-block py-2 px-2 text-sm">
                Welcome, {customer.name}
              </span>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('currentCustomer');
                navigate('/');
                toast({ title: "Logged out", description: "You have been logged out successfully" });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl">Available Products</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No products available at the moment</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No products match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={product.photoUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold">₹{product.price.toFixed(2)}</p>
                        <p className={`text-sm ${product.quantity <= 0 ? 'text-red-500' : ''}`}>
                          {product.quantity > 0 ? 
                            `${product.quantity} in stock` : 
                            "Out of stock"}
                        </p>
                      </div>
                      <p className="text-sm mt-3 line-clamp-2">{product.description}</p>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleProductSelect(product)}
                        disabled={product.quantity <= 0}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Order Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedProduct && (
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order {selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedProduct.photoUrl} 
                  alt={selectedProduct.name}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedProduct.id}</p>
                  <p className="font-bold">₹{selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea 
                  value={orderMessage}
                  onChange={(e) => setOrderMessage(e.target.value)}
                  rows={5}
                  placeholder="Specify any details about your order..."
                />
                <p className="text-xs text-gray-500">
                  This message will be sent to the shop owner along with your contact information.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleOrderSubmit}
                className="w-full sm:w-auto"
              >
                Send Order Inquiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerDashboard;
