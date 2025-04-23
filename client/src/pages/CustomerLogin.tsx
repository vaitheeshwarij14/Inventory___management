
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real app, we would check against a database
  // For now, we'll simulate with localStorage
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find((c: any) => c.email === email && c.password === password);
    
    if (customer) {
      localStorage.setItem('currentCustomer', JSON.stringify(customer));
      toast({
        title: "Login successful",
        description: `Welcome back, ${customer.name}!`,
      });
      navigate('/customer-dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Account not found. Please register.",
        variant: "destructive",
      });
      setShowRegister(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const existingCustomer = customers.find((c: any) => c.email === registerEmail);
    
    if (existingCustomer) {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return;
    }
    
    const newCustomer = { 
      id: Date.now().toString(), 
      name, 
      email: registerEmail, 
      password: registerPassword 
    };
    
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('currentCustomer', JSON.stringify(newCustomer));
    
    toast({
      title: "Registration successful",
      description: "Your account has been created!",
    });
    
    setShowRegister(false);
    navigate('/customer-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sri Sendhur Tex</h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Customer Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Login</Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowRegister(true)}
              >
                Register New Account
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="Enter your email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input 
                id="register-password" 
                type="password" 
                placeholder="Create a password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Register</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerLogin;
