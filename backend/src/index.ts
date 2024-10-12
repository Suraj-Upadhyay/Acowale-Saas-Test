import Express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
// import cors from "cors";

import router from "./router";

const PORT = process.env.PORT;
const app = Express();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://acowale-saas-test-qka4qhcda-suraj-upadhyays-projects.vercel.app/"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
//   })
// );

app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://acowale-saas-test-qka4qhcda-suraj-upadhyays-projects.vercel.app"
  ];
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(Express.json());

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100
  })
);

app.use(router);

app.get("/", (_, res) => {
  res.json({
    message: "Acowale SaaS Test!"
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
