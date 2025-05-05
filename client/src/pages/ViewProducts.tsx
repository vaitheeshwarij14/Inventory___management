import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  photoUrl: string;
}

const ViewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('  https://3670-103-196-28-179.ngrok-free.app/api/products',
          {
            headers: {
            'ngrok-skip-browser-warning': 'true'  // This bypasses the warning
          }
      });
        // console.log(await res.text());  // log the raw response
        const data = await res.json();
        console.log(data);
        setProducts(data);
      }
       catch (err) {
        // You should probably use a toast library to show the error
        alert(`Error: ${err.message || "Could not load products"}`);
      }
    };
  
    fetchProducts(); // Fetch products from the API
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl">
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
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl">All Products</CardTitle>
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
                <p className="text-gray-500 mb-4">No products found</p>
                <Button onClick={() => navigate('/add-product')}>
                  Add Your First Product
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No products match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
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
                        <p className="text-sm">
                          {product.quantity > 0 ? 
                            `${product.quantity} in stock` : 
                            "Out of stock"}
                        </p>
                      </div>
                      <p className="text-sm mt-3 line-clamp-2">{product.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
    </div>
  );
};

export default ViewProducts;
