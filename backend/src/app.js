import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // to parse json in body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to parse url

app.use(cookieParser()); // to enable CRUD operation on browser cookies

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(express.static(path.join(path.resolve(), "public", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "dist", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

export { app };
