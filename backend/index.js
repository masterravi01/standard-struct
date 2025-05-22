import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middlewares.js";
import indexRouter from "./routes/index.routes.js";

configDotenv();
const app = express();
const port = process.env.PORT || 8080; // fallback is optional

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production.
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(cookieParser());

app.get("/test", (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    data: { firstName: "John", lastName: "Wick", ...req.body },
    message: "Testing data fetch successfully !",
  });
});

// 🔹 API Routes
app.use("/sentinel", indexRouter);

// 🔹 Start Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

// 🔹 Set View Engine
app.set("view engine", "ejs");

// 🔹 Global Error Handler
app.use(errorHandler);
