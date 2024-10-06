import { body, validationResult } from "express-validator";
import { prisma } from "../helpers/prisma.helper";
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const validationErrorHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  next();
};

export const usernameValidator: RequestHandler = body("username")
  .notEmpty()
  .withMessage("Invalid username: Cannot be empty")
  .bail()
  .trim()
  .isAlphanumeric("en-US")
  .withMessage("Invalid username: Only alphanumeric characters are allowed")
  .bail()
  .isLength({ min: 5, max: 14 })
  .withMessage(
    "Invalid username: username should be between 5 to 14 characters long",
  )
  .bail();

export const passwordValidator: RequestHandler = body("password")
  .notEmpty()
  .withMessage("Invalid password: Cannot be empty")
  .bail()
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  .withMessage(
    "Invalid Password: Must be at least 8 characters with 1 lowercase, uppercase, number and symbol",
  )
  .bail()
  .isLength({ min: 8, max: 14 })
  .withMessage("Invalid Password: Must be between 8 to 14 characters longs")
  .bail();

export const confirmPasswordValidator: RequestHandler = body("confirmPassword")
  .custom((value, { req }) => value === req.body.password)
  .withMessage("Passwords do not match")
  .bail();

export const emailValidator: RequestHandler = body("email")
  .notEmpty()
  .withMessage("Invalid email: Cannot be empty")
  .isEmail({ allow_utf8_local_part: false, allow_ip_domain: false })
  .withMessage("Invalid email: email provided must be a valid email address")
  .bail();

export const usernameExistsValidator: RequestHandler = body("username")
  .custom(async (value) => {
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });
    if (usernameExists) throw "User Exists";
  })
  .withMessage("Bad Request: Username already exists")
  .bail();

export const emailExistsValidator: RequestHandler = body("email")
  .custom(async (value) => {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: value,
      },
    });
    if (emailExists) throw "Email Exists";
  })
  .withMessage("Bad Request: email already exists")
  .bail();

export const phone_numberExistsValidator: RequestHandler = body("phonenumber")
  .custom(async (value) => {
    if (!value) return true;
    const phonenumberExists = await prisma.user.findUnique({
      where: {
        phone_number: value,
      },
    });
    if (phonenumberExists) throw "Phone Number exists";
  })
  .withMessage("Bad Request: phonenumber already exists")
  .bail();

export const userExistsValidator: RequestHandler[] = [
  usernameExistsValidator,
  emailExistsValidator,
  phone_numberExistsValidator,
];
