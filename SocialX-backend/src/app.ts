import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.route";
import feedRouter from "./routes/feed.route";
import communityRouter from "./routes/community.route";
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
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
globalThis.io = io;
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join-community", (communityId: string) => {
    socket.join(`community:${communityId}`);
    console.log(`User joined community room:${communityId}`);
  });
  socket.on("leave-community", (communityId: string) => {
    socket.leave(`community:${communityId}`);
    console.log(`User left community room:${communityId}`);
  });
  socket.on("join_own_room", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room: `);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
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
app.use("/api/v1/communities", communityRouter);
app.use(errorHandler);

export { httpServer, io };

export default app;
