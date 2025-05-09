// File: src/pages/ViewProducts.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apiUrl = import.meta.env.VITE_API_URL;

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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    '' | 'priceLowHigh' | 'priceHighLow' | 'nameAsc' | 'nameDesc' | 'quantity'
  >('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        alert(`Error: ${err.message || "Could not load products"}`);
      }
    };
    fetchProducts();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products
    // filter by checkbox selections
    .filter(p =>
      selectedProductIds.length === 0 || selectedProductIds.includes(p.id)
    )
    // price range
    .filter(p =>
      (minPrice === '' || p.price >= minPrice) &&
      (maxPrice === '' || p.price <= maxPrice)
    )
    // in-stock only
    .filter(p => !showInStockOnly || p.quantity > 0)
    // sorting
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':  return a.price - b.price;
        case 'priceHighLow':  return b.price - a.price;
        case 'nameAsc':       return a.name.localeCompare(b.name);
        case 'nameDesc':      return b.name.localeCompare(a.name);
        case 'quantity':      return b.quantity - a.quantity;
        default:              return 0;
      }
    });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sri Sendhur Tex</h1>
          <Button variant="outline" onClick={() => navigate('/owner-dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {/* Checkbox list of products */}
          <div className="md:col-span-2 border rounded p-2 max-h-48 overflow-y-auto">
            <p className="font-semibold mb-2">Filter by Product:</p>
            {products.map(p => (
              <label key={p.id} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(p.id)}
                  onChange={() => toggleSelection(p.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{p.name}</span>
              </label>
            ))}
          </div>

          {/* Min Price */}
          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            onChange={e =>
              setMinPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
          />

          {/* Max Price */}
          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            onChange={e =>
              setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
          />

          {/* In-Stock Only */}
          <label className="flex items-center space-x-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={e => setShowInStockOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Available Only</span>
          </label>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="">Sort By</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="nameAsc">Name: A-Z</option>
            <option value="nameDesc">Name: Z-A</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>

        {/* Product List */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  {products.length === 0
                    ? 'No products found'
                    : 'No products match your filters'}
                </p>
                {products.length === 0 && (
                  <Button onClick={() => navigate('/add-product')}>
                    Add Your First Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
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
                          {product.quantity > 0
                            ? `${product.quantity} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                      <p className="text-sm mt-3 line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate('/owner-dashboard')}>
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ViewProducts;
