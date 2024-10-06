import Express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import router from "./router";

const PORT = process.env.PORT;
const app = Express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(Express.json());

app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
}));

app.use(router);

app.get("/", (_, res) => {
  res.json({
    message: "Acowale SaaS Test!"
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
