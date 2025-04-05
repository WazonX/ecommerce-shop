'use client'
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Common/Auth/AuthContext";
import { Product } from "../types/product";
import Link from "next/link";

export default function AdminPanel() {
    const router = useRouter();
    const { checkAuth, userInfo, logout } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

    useEffect(() => {
        if (!checkAuth() || !userInfo?.isAdmin) {
            router.push('/Login');
            return;
        }
        
        fetchData();
    }, [router, checkAuth, userInfo]);

    const fetchData = async () => {
        try {
            console.log("Starting data fetch...");
            const [productsRes, usersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/users')
            ]);
            
            if (!productsRes.ok || !usersRes.ok) {
                throw new Error(`Failed to fetch data: ${productsRes.status} ${productsRes.statusText}`);
            }

            const productsData = await productsRes.json();
            const usersData = await usersRes.json();
            
            if (!productsData || !productsData.products || !usersData || !usersData.users) {
                console.error("API returned invalid data structure");
                setError("API returned invalid data structure");
                setLoading(false);
                return;
            }
            
            setProducts(productsData.products);
            setUsers(usersData.users);
            console.log("Data loaded successfully");
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
            setLoading(false);
        }
    };

    const handleSort = (field: string) => {
        const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        
        if (activeTab === 'products') {
            const sortedProducts = [...products].sort((a, b) => {
                if (field === 'price') {
                    return newDirection === 'asc' ? a.price - b.price : b.price - a.price;
                } else if (field === 'title') {
                    return newDirection === 'asc' 
                        ? a.title.localeCompare(b.title) 
                        : b.title.localeCompare(a.title);
                } else if (field === 'id') {
                    const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
                    const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
                    return newDirection === 'asc' ? idA - idB : idB - idA;
                }
                return 0;
            });
            setProducts(sortedProducts);
        } else {
            const sortedUsers = [...users].sort((a, b) => {
                if (field === 'email') {
                    return newDirection === 'asc' 
                        ? a.email.localeCompare(b.email) 
                        : b.email.localeCompare(a.email);
                } else if (field === 'firstName') {
                    return newDirection === 'asc' 
                        ? a.firstName.localeCompare(b.firstName) 
                        : b.firstName.localeCompare(a.firstName);
                } else if (field === 'lastName') {
                    return newDirection === 'asc' 
                        ? a.lastName.localeCompare(b.lastName) 
                        : b.lastName.localeCompare(a.lastName);
                }
                return 0;
            });
            setUsers(sortedUsers);
        }
    };

    const handleDeleteProduct = async (id: number | string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete product');
            
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete user');
            
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return (
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
        );
    }

    if (error) {
        return (
                <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="text-red-500 text-xl font-semibold mb-4">
                        Error: {error}
                    </div>
                    <div className="text-white mb-4">
                        <p>Please check the console for more details or try again.</p>
                    </div>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            fetchData();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
        );
    }

    return (
        <div title="Admin Panel">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl mx-auto p-4"
            >
                <div className="text-white text-7xl font-bold w-full font-[quantico] text-center">
                    Admin Panel
                </div>
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-lg ${
                                activeTab === 'products' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-zinc-700 text-zinc-300'
                            }`}
                        >
                            Product Management
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg ${
                                activeTab === 'users' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-zinc-700 text-zinc-300'
                            }`}
                        >
                            User Management
                        </button>
                    </div>
                    <div className="flex gap-4">
                        {activeTab === 'products' && (
                            <Link 
                                href="/AdminPanel/add-product" 
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Add New Product
                            </Link>
                        )}
                        {activeTab === 'users' && (
                            <Link 
                                href="/AdminPanel/add-user" 
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Add New User
                            </Link>
                        )}
                        <button 
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-lg overflow-hidden">
                    {activeTab === 'products' ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-700">
                                <thead className="bg-zinc-900">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('id')}
                                        >
                                            ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('title')}
                                        >
                                            Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('price')}
                                        >
                                            Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-700">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-zinc-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {product.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {product.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {product.price.toFixed(2)} zł
                                                {product.discount > 0 && (
                                                    <span className="ml-2 text-red-400">-{product.discount}%</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {product.image ? (
                                                    <img 
                                                        src={`data:image/jpeg;base64,${product.image}`} 
                                                        alt={product.title} 
                                                        className="h-12 w-12 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/placeholder.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <span>No image</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                <div className="flex space-x-2">
                                                    <Link 
                                                        href={`/AdminPanel/edit-product/${product.id}`}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-700">
                                <thead className="bg-zinc-900">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('firstName')}
                                        >
                                            First Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('lastName')}
                                        >
                                            Last Name {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            Country
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            City
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            ZIP Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            Street
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-700">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.firstName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.country}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.zipCode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {user.street}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {(activeTab === 'products' && products.length === 0) || (activeTab === 'users' && users.length === 0) ? (
                        <div className="text-center py-8 text-zinc-400">
                            No {activeTab === 'products' ? 'products' : 'users'} found
                        </div>
                    ) : null}
                </div>
            </m.div>
        </div>
    );
} 