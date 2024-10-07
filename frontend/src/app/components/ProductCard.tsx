"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "../types/types"; // Assuming you have this type defined elsewhere

interface ProductCardProps {
  product: Product;
  onDelete: (productId: number) => void; // Callback for delete
}

const ProductCard: FC<ProductCardProps> = ({ product, onDelete }) => {
  const router = useRouter();

  // Function to navigate to the product edit page
  const handleEdit = () => {
    router.push(`/product/edit/${product.product_id}`);
  };

  // Function to delete the product
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${product.product_id}`,
        {
          withCredentials: true
        }
      );
      onDelete(product.product_id); // Call parent function to remove the product from the state
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{product.product_name}</h2>
      <p className="text-gray-600">{product.product_description}</p>
      <p className="font-bold text-lg">${product.price}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleEdit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
