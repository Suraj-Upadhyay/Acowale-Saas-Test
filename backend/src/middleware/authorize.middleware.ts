import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jwt.util";

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jwt = req.cookies["jwt"];
    const decodedToken = decodeToken(jwt);
    req.user_info = decodedToken as { user_id: number; username: string; role: string };
    next();
  } catch (error) {
    console.error("Error occurred in authorize: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      Error: "Failed to authorize the request",
    });
  }
}
