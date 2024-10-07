"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ProductForm, {
  ProductFormValues
} from "../../../components/ProductForm";
import { Product } from "../../../types/types"; // Assuming ProductFormValues type exists

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the id from the URL
  const [product, setProduct] = useState<Product | null>(null); // State to hold product data
  const [error, setError] = useState<string>(""); // State for error handling

  // Fetch product by id to populate the form with existing data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            withCredentials: true
          }
        );
        setProduct(res.data.data); // Set product data
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      }
    };

    if (id) {
      fetchProduct(); // Fetch product when id is available
    }
  }, [id]);

  // Handle updating the product by sending a PUT request
  const handleUpdateProduct = async (productData: ProductFormValues) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
        }
      );
      alert("Product updated successfully!");
      router.push("/dashboard"); // Redirect to dashboard after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  // Error display
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {product ? (
        <ProductForm product={product} onSubmit={handleUpdateProduct} /> // Pass product to ProductForm for editing
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditProduct;
