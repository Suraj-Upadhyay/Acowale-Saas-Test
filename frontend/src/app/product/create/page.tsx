"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import ProductForm from "../../components/ProductForm";
import { ProductFormValues } from "../../components/ProductForm";

const CreateProductPage = () => {
  const router = useRouter();

  const handleProductSubmit = async (productData: ProductFormValues) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      router.push("/dashboard"); // Redirect back to dashboard after successful creation
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleProductSubmit} />
    </div>
  );
};

export default CreateProductPage;
