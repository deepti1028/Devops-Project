import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { app } from "./app.js";
import logger from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/api/healthcheck", (req, res) => {
  return res.json({ message: "Welcome to Home route" });
});
