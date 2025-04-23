
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  React.useEffect(() => {
    // In a real app with a backend, we would verify JWT tokens
    // Here we're just checking if the user navigated properly
    const path = window.location.pathname;
    if (!path.includes('owner-dashboard')) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate('/owner-login');
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              navigate('/');
              toast({ title: "Logged out", description: "You have been logged out successfully" });
            }}
          >
            Logout
          </Button>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6">Owner Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button 
                onClick={() => navigate('/add-product')}
                className="w-full py-8 text-xl"
              >
                Add Product
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button 
                onClick={() => navigate('/update-product')}
                className="w-full py-8 text-xl"
                variant="outline"
              >
                Update Product
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button 
                onClick={() => navigate('/view-products')}
                className="w-full py-8 text-xl"
                variant="secondary"
              >
                View Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
