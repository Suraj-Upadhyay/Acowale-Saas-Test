"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import useAsyncEffect from "use-async-effect";

interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  price: number;
}

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`);
      localStorage.removeItem("token"); // Remove token from local storage
      router.push("/auth/signin");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // Function to navigate to the product creation form
  const handleAddProduct = () => {
    router.push("/product/create"); // Redirects to a page with the product creation form
  };

  useAsyncEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve JWT token from local storage
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/all`,
          {
            headers: { Authorization: `Bearer ${token}`, withCredentials: true }
          }
        );
        setProducts(res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Dashboard</h1>
        <div className="flex space-x-4">
          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold">{product.product_name}</h2>
            <p className="text-gray-600">{product.product_description}</p>
            <p className="font-bold text-lg">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
