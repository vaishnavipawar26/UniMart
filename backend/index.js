import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";

import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import orderRouter from "./routes/order.routes.js";
import Uploadrouter from "./routes/upload.routes.js";
import { socketHandler } from "./socket.js"; 
dotenv.config();
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const server = http.createServer(app);

//  Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

//  Make io available in routes/controllers
app.set("io", io);

//  Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//  Static & Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", Uploadrouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/order", orderRouter);


socketHandler(io);
//  Server start
const port = process.env.PORT || 5000;
server.listen(port, () => {
  ConnectDb();
  console.log(`🚀 Server running on port ${port}`);
});
















































