import type { Request, Response } from "express";
import { prisma } from "../helpers/prisma.helper";
import {
  IEncryptedPassword,
  comparePassword,
  encryptPassword,
} from "../utils/password.utils";
import { removeCookie, setCookie } from "../utils/cookie.util";
import { generateToken, getTokenPayloadForUser } from "../utils/jwt.util";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!userExists) {
      res
        .status(404)
        .json({ status: "Failed", message: "Username not found" });
      return;
    }

    const passwordToCompare: IEncryptedPassword = {
      hash: userExists.password_hash,
      iterations: userExists.password_iterations,
      salt: userExists.password_salt,
    };

    if (!comparePassword(password, passwordToCompare)){
      res.status(401).json({
        status: "Failed",
        message: "username or password didn't match",
      });
      return;
    }

    setCookie("jwt", generateToken(getTokenPayloadForUser(userExists)), res);

    res.status(200).json({
      status: "Successful",
      message: "User logged in successfully",
      user_info: {
        user_id: userExists.user_id,
        username: userExists.username,
      },
    });
  } catch (error) {
    console.error("An Error occurred in login controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
}

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    console.log("In Signup");
    const { username, password, email, role="USER" } = req.body;

    const passwordObject = encryptPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password_hash: passwordObject.hash,
        password_salt: passwordObject.salt,
        password_iterations: passwordObject.iterations,
        email: email,
        role: role
      },
    });

    if (!newUser) {
      res.status(500).json({
        status: "Failed",
        message: "Internal Server Error: Could not create a new user",
      });
      return;
    }

    setCookie("jwt", generateToken(getTokenPayloadForUser(newUser)), res);

    res.status(201).json({
      status: "Successful",
      message: "User successfully signed up",
      user_info: {
        user_id: newUser.user_id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("An Error occurred in signup controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
}

export async function logout(_: Request, res: Response) {
  try {
    removeCookie("jwt", res);
    res.status(200).json({
      status: "Successful",
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("An Error occurred in signup controller: ", error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
}
