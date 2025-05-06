// Directory structure:
// frontend/
//   src/
//     pages/
//       CustomerLogin.tsx
// backend/
//   models/
//     Customer.js
//   routes/
//     customerRoutes.js
//   server.js

// --- FRONTEND: CustomerLogin.tsx (React + Tailwind + EmailJS + Axios) ---
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
const apiUrl = import.meta.env.VITE_API_URL;
const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState<'info' | 'otp' | 'password'>('info');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!uppercase.test(password)) return "Password must contain at least one uppercase letter.";
    if (!lowercase.test(password)) return "Password must contain at least one lowercase letter.";
    if (!number.test(password)) return "Password must contain at least one number.";
    if (!specialChar.test(password)) return "Password must contain at least one special character.";
    return "";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/customers/login`, { email, password });
      toast({ title: "Login successful", description: `Welcome back, ${res.data.name}!` });
      localStorage.setItem('currentCustomer', JSON.stringify(res.data));
      navigate('/customer-dashboard');
    } catch (err: any) {
      toast({ title: "Login failed", description: err.response.data.message, variant: "destructive" });
    }
  };

  const sendOtp = async () => {
    if (!registerEmail || !registerName) {
      return toast({ title: "Missing Fields", description: "Enter name and email.", variant: "destructive" });
    }

    try {
      const res = await axios.post(`${apiUrl}/api/customers/check`, { email: registerEmail });
      if (res.data.exists) {
        return toast({ title: "Account exists", description: "Try logging in.", variant: "destructive" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      const expiry = new Date(Date.now() + 15 * 60000);
      const formattedTime = expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await emailjs.send('service_pm5vaq5', 'template_7cy25ms', {
        email: registerEmail,
        passcode: otp,
        time: formattedTime
      }, '2KD82uZrbtVRvvA9Z');

      toast({ title: "OTP Sent", description: `Check your email: ${registerEmail}` });
      setRegisterStep('otp');
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    }
  };

  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      toast({ title: "OTP Verified", description: "Now set a password." });
      setRegisterStep('password');
    } else {
      toast({ title: "Invalid OTP", description: "Check the OTP and try again.", variant: "destructive" });
    }
  };

  const handleFinalRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(registerPassword);
    if (passwordError) return toast({ title: "Invalid Password", description: passwordError, variant: "destructive" });

    try {
      const res = await axios.post(`${apiUrl}/api/customers/register`, {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      toast({ title: "Registered", description: "Account created!" });
      localStorage.setItem('currentCustomer', JSON.stringify(res.data));
      setShowRegister(false);
      navigate('/customer-dashboard');
    } catch (err: any) {
      toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sri Sendhur Tex</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Customer Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Login</Button>
              <Button type="button" variant="outline" onClick={() => { setShowRegister(true); setRegisterStep('info'); }} className="w-full">Register</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="w-full">Back</Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{registerStep === 'info' ? "Create Account" : registerStep === 'otp' ? "Enter OTP" : "Set Password"}</DialogTitle>
          </DialogHeader>

          {registerStep === 'info' && (
            <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Send OTP</Button>
              </DialogFooter>
            </form>
          )}

          {registerStep === 'otp' && (
            <div className="space-y-4">
              <Label>OTP</Label>
              <Input value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} required />
              <DialogFooter>
                <Button onClick={verifyOtp} className="w-full">Verify OTP</Button>
              </DialogFooter>
            </div>
          )}

          {registerStep === 'password' && (
            <form onSubmit={handleFinalRegistration} className="space-y-4">
              <Label>Password</Label>
              <Input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
              <DialogFooter>
                <Button type="submit" className="w-full">Register</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerLogin;

// Let me know when you're ready for the backend files.
