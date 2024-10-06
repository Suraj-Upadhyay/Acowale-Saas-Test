// types/express/index.d.ts

import * as express from "express";

// Extending the Request interface in the express module
declare global {
  namespace Express {
    interface Request {
      user_info?: {
        user_id: number;
        username: string;
      };
    }
  }
}
