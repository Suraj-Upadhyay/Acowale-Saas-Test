import { Request, Response } from "express";
import { prisma } from "../helpers/prisma.helper";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { product_name, product_description, price } = req.body;
    const username = req.user_info?.username;

    // Validate required fields
    if (!product_name || !price) {
      res.status(400).json({
        status: "Failed",
        message: "Missing required fields: product_name, price, and user_id"
      });
      return;
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { username: username } // Convert user_id to integer
    });

    if (!user) {
      res.status(404).json({
        status: "Failed",
        message: "User not found"
      });
      return;
    }

    // Create the new product
    const product = await prisma.product.create({
      data: {
        product_name,
        product_description,
        price: parseInt(price), // Ensure price is an integer
        user: { connect: { user_id: user.user_id } } // Link to the user
      }
    });

    // Respond with the created product
    res.status(201).json({
      status: "Success",
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("An Error occurred in createProduct controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error"
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract the product ID from the request params

    // Validate that the ID is a number
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        status: "Failed",
        message: "Invalid product ID"
      });
      return;
    }

    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id) // Convert id to an integer
      },
      include: {
        user: true // Optionally, include related user data
      }
    });

    // Check if the product exists
    if (!product) {
      res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
      return;
    }

    if (
      req.user_info !== undefined &&
      (product.user_id !== req.user_info.user_id &&
        req.user_info.role !== "ADMIN")
    ) {
      res.status(403).json({
        status: "Forbidden",
        message: "User does not have proper rights to access the product"
      });
      return;
    }

    // Respond with the found product
    res.status(200).json({ status: "Success", data: product });
  } catch (error) {
    console.error("An Error occurred in getProduct controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error"
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract product ID from route parameters
    const { product_name, product_description, price } = req.body; // Extract fields to update from request body

    // Validate that the ID is a number
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        status: "Failed",
        message: "Invalid product ID"
      });
      return;
    }

    // Validate that at least one field to update is provided
    if (!product_name && !product_description && !price) {
      res.status(400).json({
        status: "Failed",
        message: "At least one field must be provided to update"
      });
      return;
    }

    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id) // Convert id to an integer
      },
      include: {
        user: true // Optionally, include related user data
      }
    });

    // Check if the product exists
    if (!product) {
      res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
      return;
    }

    if (
      req.user_info !== undefined &&
      (product.user_id !== req.user_info.user_id &&
        req.user_info.role !== "ADMIN")
    ) {
      res.status(403).json({
        status: "Forbidden",
        message: "User does not have proper rights to access the product"
      });
      return;
    }

    // Find and update the product
    const updatedProduct = await prisma.product.update({
      where: { product_id: parseInt(id) }, // Convert id to an integer
      data: {
        product_name,
        product_description,
        price: price ? parseInt(price) : undefined // Convert price to integer if provided
      }
    });

    // Respond with the updated product
    res.status(200).json({
      status: "Success",
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    console.error("An Error occurred in updateProduct controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error"
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract product ID from route parameters

    // Validate that the ID is a number
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        status: "Failed",
        message: "Invalid product ID"
      });
      return;
    }

    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id) // Convert id to an integer
      },
      include: {
        user: true // Optionally, include related user data
      }
    });

    // Check if the product exists
    if (!product) {
      res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
      return;
    }

    if (
      req.user_info !== undefined &&
      (product.user_id !== req.user_info.user_id &&
        req.user_info.role !== "ADMIN")
    ) {
      res.status(403).json({
        status: "Forbidden",
        message: "User does not have proper rights to access the product"
      });
    }

    // Delete the product by ID
    const deletedProduct = await prisma.product.delete({
      where: { product_id: parseInt(id) } // Convert id to an integer
    });

    // Respond with a success message
    res.status(200).json({
      status: "Success",
      message: "Product deleted successfully",
      data: deletedProduct // Optionally return the deleted product details
    });
  } catch (error) {
    if (error instanceof Error && (error as any).code === "P2025") {
      // Handle case where product does not exist
      res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
      return;
    }
    console.error("An Error occurred in deleteProduct controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error"
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    if (
      req.user_info === undefined ||
      (req.user_info !== undefined && req.user_info.role !== "ADMIN")
    ) {
      res.status(403).json({
        status: "Forbidden",
        message: "Operation forbidden for the user"
      });
      return;
    }
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      include: {
        user: true // Optionally include related user data
      }
    });

    // Respond with the list of products
    res.status(200).json({ status: "Success", data: products });
  } catch (error) {
    console.error("An Error occurred in getAllProducts controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error"
    });
  }
};
