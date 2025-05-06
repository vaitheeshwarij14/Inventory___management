import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const apiUrl = import.meta.env.VITE_API_URL;
const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | ''>(0);
  const [quantity, setQuantity] = useState<number | ''>(0);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [specificFields, setSpecificFields] = useState<string[]>([]);
  const [material, setMaterial] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckboxChange = (field: string) => {
    setSpecificFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrl = photo ? URL.createObjectURL(photo) : 'https://placehold.co/400x300?text=Product+Image';

    const newProduct = {
      name: productName,
      price: Number(price),
      quantity: Number(quantity),
      description,
      photoUrl: imageUrl,
      createdAt: new Date().toISOString(),
      specificFields,
      material
    };

    await fetch(`${apiUrl}/api/products/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    toast({ title: "Success", description: "Product added successfully" });

    // Reset form
    setProductName('');
    setPrice(0);
    setQuantity(0);
    setDescription('');
    setPhoto(null);
    setSpecificFields([]);
    setMaterial('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <Button variant="outline" onClick={() => navigate('/owner-dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Add New Product</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName" className="font-bold">Product Name</Label>
                <Input id="productName" placeholder="Enter product name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="font-bold">Price (₹)</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={() => setPrice(p => Math.max(Number(p || 0) - 1, 0))}>-</Button>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 text-center"
                    required
                  />
                  <Button type="button" onClick={() => setPrice(p => Number(p || 0) + 1)}>+</Button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label className="font-bold">Available Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={() => setQuantity(q => Math.max(Number(q || 0) - 1, 0))}>-</Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 text-center"
                    required
                  />
                  <Button type="button" onClick={() => setQuantity(q => Number(q || 0) + 1)}>+</Button>
                </div>
              </div>

              {/* Specific Fields */}
              <div className="space-y-2">
                <Label className="font-bold">Specific Fields</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["9 x 5 vestti", "30*60 Towel", "cooltex Towels", "Printed Towels", "Pure White", "Muttu pett", "Parties"].map(field => (
                    <label key={field} className="flex items-center space-x-2">
                      <Checkbox checked={specificFields.includes(field)} onCheckedChange={() => handleCheckboxChange(field)} />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-2">
                <Label className="font-bold">Material</Label>
                <RadioGroup value={material} onValueChange={setMaterial}>
                  {["cotten", "Polyester", "nylon"].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="font-bold">Upload Photo</Label>
                <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate('/owner-dashboard')}>Cancel</Button>
              <Button type="submit">Add Product</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
