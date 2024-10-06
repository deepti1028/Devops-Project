import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.static());

app.get("/", (req, res) => {
  res.send("Hello ");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
