import type { Response } from "express";

export async function setCookie(name: string, payload: string, res: Response) {
  try {
    console.log(name);
    console.log(payload);
    res.cookie(name, payload, {
      maxAge: 24 * 60 * 60 * 1000, // 1 Day in  milliseconds
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/"
    });
  } catch (error) {
    console.error("Error occurred in setCookie: ", error);
    throw error;
  }
}

export async function removeCookie(name: string, res: Response) {
  try {
    res.clearCookie(name);
  } catch (error) {
    console.error("Error occurred in removeCookie: ", error);
    throw error;
  }
}
