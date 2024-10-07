"use client";

import { FC, useEffect } from "react";
import { Product } from "../types/types";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  product?: Product; // Optional for editing
  onSubmit: (productData: ProductFormValues) => void;
}

export interface ProductFormValues {
  product_name: string;
  product_description: string;
  price: number;
}

const ProductForm: FC<ProductFormProps> = ({ product, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({
    defaultValues: product
      ? {
          product_name: product.product_name,
          product_description: product.product_description,
          price: product.price
        }
      : undefined
  });

  useEffect(() => {
    if (product) {
      setValue("product_name", product.product_name);
      setValue("product_description", product.product_description);
      setValue("price", product.price);
    }
  }, [product, setValue]);

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data);
    reset(); // Clear form after submit
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          {...register("product_name", {
            required: "Product name is required"
          })}
          className={`mt-1 p-2 w-full border ${
            errors.product_name ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.product_name && (
          <p className="text-red-500 text-sm">{errors.product_name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Description
        </label>
        <textarea
          {...register("product_description", {
            required: "Product description is required"
          })}
          className={`mt-1 p-2 w-full border ${
            errors.product_description ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.product_description && (
          <p className="text-red-500 text-sm">
            {errors.product_description.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true
          })}
          className={`mt-1 p-2 w-full border ${
            errors.price ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        {product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
