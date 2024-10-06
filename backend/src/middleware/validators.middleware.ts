import {
  usernameValidator,
  passwordValidator,
  validationErrorHandler,
  confirmPasswordValidator,
  emailValidator,
  userExistsValidator,
} from "../utils/validators.util";

export const loginValidator = [
  usernameValidator,
  passwordValidator,
  validationErrorHandler,
];

export const signupValidator = [
  usernameValidator,
  passwordValidator,
  confirmPasswordValidator,
  emailValidator,
  ...userExistsValidator,
  validationErrorHandler,
];
