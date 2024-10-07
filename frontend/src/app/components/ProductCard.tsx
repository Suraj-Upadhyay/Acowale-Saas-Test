import { FC } from "react";
import { Product } from "../types/types"; // Importing the Product type

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{product.product_name}</h2>
      <p className="text-gray-700 mb-4">{product.product_description}</p>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">${product.price}</p>
        <div className="flex space-x-4">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.product_id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
