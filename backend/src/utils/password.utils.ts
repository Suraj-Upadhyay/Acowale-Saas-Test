import { pbkdf2Sync, randomBytes } from "crypto";

const keylen = 64;
const AlgorithmUsed = "SHA512";

export interface IEncryptedPassword {
  hash: string;
  salt: string;
  iterations: number;
}

export function encryptPassword(password: string): IEncryptedPassword {
  const salt = randomBytes(128).toString("base64");
  const iterations = 10000;
  const hash = pbkdf2Sync(password, salt, iterations, keylen, AlgorithmUsed);
  return {
    hash: hash.toString("base64") as string,
    salt: salt,
    iterations: iterations,
  };
}

export function comparePassword(
  passwordAttempt: string,
  encryptPassword: IEncryptedPassword,
): boolean {
  const hashAttempt = pbkdf2Sync(
    passwordAttempt,
    encryptPassword.salt,
    encryptPassword.iterations,
    keylen,
    AlgorithmUsed,
  );
  return hashAttempt.toString("base64") === encryptPassword.hash;
}
