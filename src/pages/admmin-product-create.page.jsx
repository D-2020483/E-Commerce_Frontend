import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';

// API base URL
const API_BASE_URL = 'https://fed-storefront-backend-dinithi.onrender.com/api';

const AdminCreateProductPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        categoryId: '',
        variants: [{ name: 'default', stock: 0 }]
    });
    const [loading, setLoading] = useState(true);

    // Fetch existing products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/products`),
                    fetch(`${API_BASE_URL}/categories`)
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [productsData, categoriesData] = await Promise.all([
                    productsRes.json(),
                    categoriesRes.json()
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!isLoaded) {
        return <main className="px-8">Loading...</main>;
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" />;
    }

    if (user.publicMetadata?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            // Validate price and stock are positive numbers
            if (parseFloat(newProduct.price) <= 0) {
                toast.error('Price must be greater than 0');
                return;
            }
            if (parseInt(newProduct.variants[0].stock) < 0) {
                toast.error('Stock cannot be negative');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newProduct,
                    price: parseFloat(newProduct.price),
                    variants: [{ 
                        name: 'default', 
                        stock: parseInt(newProduct.variants[0].stock) 
                    }]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            toast.success('Product created successfully');
            // Reset form
            setNewProduct({
                name: '',
                price: '',
                description: '',
                image: '',
                categoryId: '',
                variants: [{ name: 'default', stock: 0 }]
            });
            
            // Refresh products list
            const productsRes = await fetch(`${API_BASE_URL}/products`);
            const updatedProducts = await productsRes.json();
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error(error.message || 'Failed to create product');
        }
    };

    const handleUpdateStock = async (productId, newStock) => {
        try {
            const stock = parseInt(newStock);
            if (stock < 0) {
                toast.error('Stock cannot be negative');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    variantName: 'default',
                    stock: stock
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update stock');
            }

            toast.success('Stock updated successfully');
            
            // Update the product in the local state
            setProducts(products.map(product => {
                if (product._id === productId) {
                    return {
                        ...product,
                        variants: [{ name: 'default', stock: stock }]
                    };
                }
                return product;
            }));
        } catch (error) {
            console.error('Error updating stock:', error);
            toast.error(error.message || 'Failed to update stock');
        }
    };

    return (
        <main className="px-8 py-6">
            <h1 className="text-4xl font-bold mb-6">Product Management</h1>
            
            {/* Create New Product Form */}
            <Card className="p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                required
                                placeholder="Product name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <Input
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                required
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={newProduct.categoryId}
                                onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Initial Stock</label>
                            <Input
                                type="number"
                                min="0"
                                value={newProduct.variants[0].stock}
                                onChange={(e) => setNewProduct({
                                    ...newProduct,
                                    variants: [{ name: 'default', stock: parseInt(e.target.value) || 0 }]
                                })}
                                required
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            required
                            rows="3"
                            placeholder="Product description"
                        />
                    </div>
                    <Button type="submit">Create Product</Button>
                </form>
            </Card>

            {/* Existing Products List */}
            <h2 className="text-2xl font-semibold mb-4">Manage Existing Products</h2>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Card key={product._id} className="p-4">
                            <div className="flex items-center space-x-4">
                                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-500">Price: ${parseFloat(product.price).toFixed(2)}</p>
                                    <div className="flex items-center mt-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            defaultValue={product.variants?.[0]?.stock || 0}
                                            className="w-24 mr-2"
                                            onBlur={(e) => {
                                                const newStock = e.target.value;
                                                if (newStock !== (product.variants?.[0]?.stock || 0).toString()) {
                                                    handleUpdateStock(product._id, newStock);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-500">in stock</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
};

export default AdminCreateProductPage;          