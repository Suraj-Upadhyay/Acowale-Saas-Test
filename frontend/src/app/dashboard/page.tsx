"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import useAsyncEffect from "use-async-effect";
import ProductCard from "../components/ProductCard"; // Import ProductCard component
import { Product } from "../types/types"; // Assuming you have this type defined elsewhere

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("token"); // Remove token from local storage
      router.push("/auth/signin");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // Function to navigate to the product creation form
  const handleAddProduct = () => {
    router.push("/product/create");
  };

  useAsyncEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/all`,
          {
            withCredentials: true
          }
        );
        setProducts(res.data.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // Function to remove a product from the list after deletion
  const handleDeleteProduct = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.product_id !== productId)
    );
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
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
          <ProductCard
            key={product.product_id}
            product={product}
            onDelete={handleDeleteProduct} // Pass delete handler
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
