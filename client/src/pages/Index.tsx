
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center my-8">Sri Sendhur Tex</h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome to Inventory Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Button 
              onClick={() => navigate('/owner-login')}
              className="w-full py-8 text-lg"
            >
              Owner
            </Button>
            <Button
              onClick={() => navigate('/customer-login')}
              variant="outline"
              className="w-full py-8 text-lg"
            >
              Customer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
