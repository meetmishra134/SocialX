import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.route";
import feedRouter from "./routes/feed.route";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import path from "path";

declare global {
  var io: Server;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  },
});
globalThis.io = io;
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_own_room", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room: `);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/feed", feedRouter);
app.use(errorHandler);

export { httpServer, io };

export default app;
