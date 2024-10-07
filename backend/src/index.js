import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

const __dirname = path.resolve();

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

const origins = process.env.CORS_ORIGIN?.split(",") || [];

// Set up CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the request origin is allowed
      if (!origin || origins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow sending cookies across domains
  })
);

app.get("/api", (req, res) => {
  console.log("Inside the Home route");
  return res.json({ message: "Hello From Api Home route" });
});

app.use(express.static(path.join(__dirname, "public", "dist")));
// Catch-all route should come after all other routes
app.get("/*", (req, res) => {
  console.log("Inside the catch-all route");
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
